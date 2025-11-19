// Shared data service that works in both development and production
const STORAGE_KEY = 'shared-expense-data';

// Simulate a shared storage using localStorage with cross-tab communication
class SharedDataService {
  constructor() {
    this.initialized = false;
  }

  // Initialize the service
  init() {
    if (!this.initialized) {
      this.startSync();
      this.initialized = true;
    }
    return this.getData();
  }

  // Get all data
  getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initialData = {
        expenses: [],
        people: ['Amaan Akhtar', 'Tabrej Alam', 'Mohd Ehtisham', 'Mohd Usman', 'Mohd Najam'],
        lastUpdated: Date.now()
      };
      this.saveData(initialData);
      return initialData;
    }
    return JSON.parse(data);
  }

  // Save data with timestamp
  saveData(data) {
    const dataWithTimestamp = {
      ...data,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    
    // Also save to a backup key for cross-tab communication
    localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(dataWithTimestamp));
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(dataWithTimestamp)
    }));
  }

  // Add expense
  addExpense(expense) {
    const data = this.getData();
    const newExpense = {
      ...expense,
      id: Date.now() + Math.random(), // Ensure unique ID
    };
    data.expenses.push(newExpense);
    this.saveData(data);
    return newExpense;
  }

  // Delete expense
  deleteExpense(id) {
    const data = this.getData();
    data.expenses = data.expenses.filter(exp => exp.id !== id);
    this.saveData(data);
    return true;
  }

  // Add person
  addPerson(name) {
    const data = this.getData();
    if (!data.people.includes(name)) {
      data.people.push(name);
      this.saveData(data);
    }
    return data.people;
  }

  // Remove person
  removePerson(name) {
    const data = this.getData();
    data.people = data.people.filter(person => person !== name);
    this.saveData(data);
    return data.people;
  }

  // Start syncing across tabs/windows
  startSync() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsedData = JSON.parse(e.newValue);
          // Notify listeners about data changes
          window.dispatchEvent(new CustomEvent('sharedDataUpdate', {
            detail: parsedData
          }));
        } catch (error) {
          console.error('Error parsing storage data:', error);
        }
      }
    });

    // No periodic sync needed - only cross-tab communication
  }

  // Stop syncing
  stopSync() {
    this.initialized = false;
  }

  // Subscribe to data changes
  onDataChange(callback) {
    const handler = (e) => {
      if (e.detail && typeof e.detail === 'object') {
        callback(e.detail);
      }
    };
    window.addEventListener('sharedDataUpdate', handler);
    return handler; // Return handler for cleanup
  }

  // Unsubscribe from data changes
  offDataChange(handler) {
    window.removeEventListener('sharedDataUpdate', handler);
  }
}

// Create a singleton instance
const sharedDataService = new SharedDataService();

export default sharedDataService;