import express from 'express';
import cors from 'cors';
import dbService from './src/dbService.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize database connection
await dbService.connect();

// Get all data
app.get('/api/data/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const expenses = await dbService.getExpenses(roomId);
    const people = await dbService.getPeople(roomId);
    res.json({ expenses, people });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Add expense
app.post('/api/expenses/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const newExpense = await dbService.addExpense(req.body, roomId);
    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await dbService.deleteExpense(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Add person
app.post('/api/people/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name } = req.body;
    await dbService.addPerson(name, roomId);
    const people = await dbService.getPeople(roomId);
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add person' });
  }
});

// Remove person
app.delete('/api/people/:roomId/:name', async (req, res) => {
  try {
    const { roomId, name } = req.params;
    await dbService.removePerson(name, roomId);
    const people = await dbService.getPeople(roomId);
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove person' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});