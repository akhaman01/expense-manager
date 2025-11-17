import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : []
  })
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'fixed', purchasedBy: '' })
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
  const [newPersonName, setNewPersonName] = useState('')
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem('people')
    return saved ? JSON.parse(saved) : ['Amaan Akhtar', 'Tabrej Alam', 'Mohd Ehtisham', 'Mohd Usman', 'Mohd Najam']
  })

  const expenseCategories = {
    fixed: ['Room Rent', 'Electricity Bill', 'Maid Salary', 'Internet', 'Gas'],
    daily: ['Milk', 'Vegetables', 'Groceries', 'Transportation', 'Food']
  }



  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people))
  }, [people])

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const expense = {
        id: Date.now(),
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0],
        month: currentMonth
      }
      setExpenses([...expenses, expense])
      setNewExpense({ name: '', amount: '', category: 'fixed', purchasedBy: '' })
    }
  }

  const addPerson = () => {
    if (newPersonName.trim() && !people.includes(newPersonName.trim())) {
      setPeople([...people, newPersonName.trim()])
      setNewPersonName('')
    }
  }

  const removePerson = (personToRemove) => {
    setPeople(people.filter(person => person !== personToRemove))
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  const getCurrentMonthExpenses = () => {
    return expenses.filter(exp => exp.month === currentMonth)
  }

  const getTotalByCategory = (category) => {
    return getCurrentMonthExpenses()
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
  }

  const getTotalExpenses = () => {
    return getCurrentMonthExpenses().reduce((sum, exp) => sum + exp.amount, 0)
  }

  const getPersonSpending = () => {
    const spending = {}
    getCurrentMonthExpenses().forEach(exp => {
      if (exp.purchasedBy) {
        spending[exp.purchasedBy] = (spending[exp.purchasedBy] || 0) + exp.amount
      }
    })
    return Object.entries(spending)
      .map(([person, amount]) => ({ person, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  const getSettlementCalculation = () => {
    const totalExpenses = getTotalExpenses()
    const equalShare = totalExpenses / people.length
    const personSpending = {}
    
    // Initialize all people with 0 spending
    people.forEach(person => {
      personSpending[person] = 0
    })
    
    // Add actual spending
    getCurrentMonthExpenses().forEach(exp => {
      if (exp.purchasedBy) {
        personSpending[exp.purchasedBy] += exp.amount
      }
    })
    
    return people.map(person => {
      const spent = personSpending[person]
      const balance = spent - equalShare
      return {
        person,
        spent,
        equalShare,
        balance,
        status: balance > 0 ? 'overpaid' : balance < 0 ? 'owes' : 'settled'
      }
    }).sort((a, b) => b.balance - a.balance)
  }

  const monthlyExpenses = getCurrentMonthExpenses()
  const fixedTotal = getTotalByCategory('fixed')
  const dailyTotal = getTotalByCategory('daily')
  const grandTotal = getTotalExpenses()
  const personSpending = getPersonSpending()
  const settlementData = getSettlementCalculation()

  return (
    <div className="app">
      <header className="header">
        <h1>🏠 Room Expense Manager</h1>
        <div className="month-selector">
          <label>Month: </label>
          <input 
            type="month" 
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
          />
        </div>
      </header>

      <div className="container">
        <div className="add-person">
          <h2>👥 Manage People</h2>
          <div className="person-form">
            <input
              type="text"
              placeholder="Enter new person name"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
            />
            <button onClick={addPerson}>Add Person</button>
          </div>
          <div className="people-list">
            {people.map(person => (
              <div key={person} className="person-tag">
                <span>{person}</span>
                <button onClick={() => removePerson(person)} className="remove-person">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="add-expense">
          <h2>Add New Expense</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Expense name"
              value={newExpense.name}
              onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            />
            <select 
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            >
              <option value="fixed">Fixed Monthly</option>
              <option value="daily">Daily/Variable</option>
            </select>
            <select 
              value={newExpense.purchasedBy}
              onChange={(e) => setNewExpense({...newExpense, purchasedBy: e.target.value})}
            >
              <option value="">Select Person</option>
              {people.map(person => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
            <button onClick={addExpense}>Add Expense</button>
          </div>
        </div>

        <div className="summary">
          <h2>Monthly Summary - {new Date(currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="summary-cards">
            <div className="card fixed">
              <h3>Fixed Expenses</h3>
              <p className="amount">₹{fixedTotal.toFixed(2)}</p>
            </div>
            <div className="card daily">
              <h3>Daily/Variable</h3>
              <p className="amount">₹{dailyTotal.toFixed(2)}</p>
            </div>
            <div className="card total">
              <h3>Total Monthly</h3>
              <p className="amount">₹{grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {personSpending.length > 0 && (
          <div className="person-spending">
            <h2>👥 Spending by Person</h2>
            <div className="spending-list">
              {personSpending.map((item, index) => (
                <div key={item.person} className={`spending-item ${index === 0 ? 'highest' : ''}`}>
                  <div className="person-info">
                    <span className="person-name">{item.person}</span>
                    {index === 0 && <span className="badge">Highest Spender</span>}
                  </div>
                  <span className="person-amount">₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {grandTotal > 0 && (
          <div className="settlement">
            <h2>💰 Monthly Settlement</h2>
            <div className="settlement-info">
              <div className="settlement-summary">
                <p><strong>Total Expenses:</strong> ₹{grandTotal.toFixed(2)}</p>
                <p><strong>Equal Share per Person:</strong> ₹{(grandTotal / people.length).toFixed(2)}</p>
                <p><strong>Total Members:</strong> {people.length}</p>
              </div>
            </div>
            <div className="settlement-list">
              {settlementData.map(item => (
                <div key={item.person} className={`settlement-item ${item.status}`}>
                  <div className="settlement-person">
                    <span className="person-name">{item.person}</span>
                    <div className="settlement-details">
                      <span className="spent">Spent: ₹{item.spent.toFixed(2)}</span>
                      <span className="share">Fair Share: ₹{item.equalShare.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="settlement-balance">
                    {item.status === 'overpaid' && (
                      <div className="balance overpaid">
                        <span className="label">Should Receive</span>
                        <span className="amount">₹{Math.abs(item.balance).toFixed(2)}</span>
                      </div>
                    )}
                    {item.status === 'owes' && (
                      <div className="balance owes">
                        <span className="label">Needs to Pay</span>
                        <span className="amount">₹{Math.abs(item.balance).toFixed(2)}</span>
                      </div>
                    )}
                    {item.status === 'settled' && (
                      <div className="balance settled">
                        <span className="label">Settled</span>
                        <span className="amount">₹0.00</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="expenses-list">
          <h2>Expense Details</h2>
          {monthlyExpenses.length === 0 ? (
            <p className="no-expenses">No expenses recorded for this month</p>
          ) : (
            <div className="expense-items">
              {monthlyExpenses.map(expense => (
                <div key={expense.id} className={`expense-item ${expense.category}`}>
                  <div className="expense-info">
                    <span className="name">{expense.name}</span>
                    <span className="category">{expense.category}</span>
                    <span className="date">{new Date(expense.date).toLocaleDateString()}</span>
                    {expense.purchasedBy && <span className="purchaser">👤 {expense.purchasedBy}</span>}
                  </div>
                  <div className="expense-amount">
                    <span>₹{expense.amount.toFixed(2)}</span>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
