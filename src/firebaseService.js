class FirebaseService {
  constructor() {
    this.available = false;
    this.roomId = localStorage.getItem('roomId') || this.generateRoomId();
    localStorage.setItem('roomId', this.roomId);
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async init() {
    return false; // Firebase disabled
  }

  async getData() {
    return { expenses: [], people: [] };
  }

  async addExpense(expense) {
    return expense;
  }

  async deleteExpense(id) {
    return;
  }

  async updatePeople(people) {
    return;
  }

  async onDataChange(callback) {
    return () => {};
  }

  getRoomId() {
    return this.roomId;
  }

  setRoomId(roomId) {
    this.roomId = roomId;
    localStorage.setItem('roomId', roomId);
  }
}

export default new FirebaseService();