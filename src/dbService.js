import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'database-1.cfw2eemcibky.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD || 'your-password-here',
  database: 'expense_manager',
  port: 3306
};

class DatabaseService {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await mysql.createConnection(dbConfig);
      await this.initTables();
    }
    return this.connection;
  }

  async initTables() {
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        purchasedBy VARCHAR(255),
        date DATE NOT NULL,
        month VARCHAR(7) NOT NULL,
        roomId VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        roomId VARCHAR(10) NOT NULL,
        UNIQUE KEY unique_person_room (name, roomId)
      )
    `);
  }

  async getExpenses(roomId) {
    const [rows] = await this.connection.execute(
      'SELECT * FROM expenses WHERE roomId = ? ORDER BY created_at DESC',
      [roomId]
    );
    return rows;
  }

  async addExpense(expense, roomId) {
    const [result] = await this.connection.execute(
      'INSERT INTO expenses (name, amount, category, purchasedBy, date, month, roomId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense.name, expense.amount, expense.category, expense.purchasedBy, expense.date, expense.month, roomId]
    );
    return { ...expense, id: result.insertId };
  }

  async deleteExpense(id) {
    await this.connection.execute('DELETE FROM expenses WHERE id = ?', [id]);
  }

  async getPeople(roomId) {
    const [rows] = await this.connection.execute(
      'SELECT name FROM people WHERE roomId = ?',
      [roomId]
    );
    return rows.map(row => row.name);
  }

  async addPerson(name, roomId) {
    await this.connection.execute(
      'INSERT IGNORE INTO people (name, roomId) VALUES (?, ?)',
      [name, roomId]
    );
  }

  async removePerson(name, roomId) {
    await this.connection.execute(
      'DELETE FROM people WHERE name = ? AND roomId = ?',
      [name, roomId]
    );
  }
}

export default new DatabaseService();