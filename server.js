import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'shared-data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    expenses: [],
    people: ['Amaan Akhtar', 'Tabrej Alam', 'Mohd Ehtisham', 'Mohd Usman', 'Mohd Najam']
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Get all data
app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Add expense
app.post('/api/expenses', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newExpense = { ...req.body, id: Date.now() };
    data.expenses.push(newExpense);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.expenses = data.expenses.filter(exp => exp.id !== parseInt(req.params.id));
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Add person
app.post('/api/people', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const { name } = req.body;
    if (!data.people.includes(name)) {
      data.people.push(name);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
    res.json(data.people);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add person' });
  }
});

// Remove person
app.delete('/api/people/:name', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.people = data.people.filter(person => person !== req.params.name);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(data.people);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove person' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});