# Room Expense Manager - Multi-User Shared Expenses

A React-based expense management application that allows multiple users to share and track expenses together.

## Features

- **Shared Expense Tracking**: All users can see expenses from everyone
- **Multi-User Support**: Add/remove people from the expense group
- **Monthly Expense Management**: Track expenses by month
- **Settlement Calculations**: Automatic calculation of who owes what
- **Real-time Synchronization**: Changes are immediately visible to all users

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

```bash
npm start
```

This will start both the backend server (port 3001) and the React development server (port 5173).

### Alternative: Start Services Separately

```bash
# Terminal 1 - Start backend server
npm run server

# Terminal 2 - Start React app
npm run dev
```

## How It Works

The application now uses a shared backend server instead of localStorage, which means:

- **Before**: Each user could only see their own expenses (stored in browser localStorage)
- **After**: All users see the same shared expenses (stored on server)

### Key Changes Made

1. **Added Express Backend**: Simple server to handle shared data storage
2. **API Integration**: React app now makes API calls instead of using localStorage
3. **Real-time Updates**: All users see changes immediately
4. **Shared Data File**: All expenses and people are stored in `shared-data.json`

## Usage

1. **Access the App**: Open `http://localhost:5173` in multiple browsers/tabs to simulate different users
2. **Add People**: Manage the list of people who share expenses
3. **Add Expenses**: Any user can add expenses that everyone will see
4. **View Settlements**: See who owes money and who should receive money
5. **Monthly Tracking**: Switch between different months to track expenses over time

## Technical Details

- **Frontend**: React with Vite
- **Backend**: Express.js server
- **Data Storage**: JSON file (shared-data.json)
- **API Endpoints**:
  - `GET /api/data` - Fetch all expenses and people
  - `POST /api/expenses` - Add new expense
  - `DELETE /api/expenses/:id` - Delete expense
  - `POST /api/people` - Add person
  - `DELETE /api/people/:name` - Remove person

## Troubleshooting

- **Port Issues**: Make sure ports 3001 and 5173 are available
- **CORS Errors**: The server includes CORS middleware to handle cross-origin requests
- **Data Persistence**: Data is stored in `shared-data.json` file in the project root