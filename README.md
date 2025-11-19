# Room Expense Manager - Multi-User Shared Expenses

A React-based expense management application that allows multiple users to share and track expenses together.

## Features

- **Shared Expense Tracking**: All users can see expenses from everyone
- **Multi-User Support**: Add/remove people from the expense group
- **Monthly Expense Management**: Track expenses by month
- **Settlement Calculations**: Automatic calculation of who owes what
- **Real-time Synchronization**: Changes are immediately visible across browser tabs/windows
- **Production Ready**: Works without a backend server

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

## How It Works

The application uses a smart shared data service that works in both development and production:

- **Shared Storage**: Uses localStorage with cross-tab synchronization
- **Real-time Updates**: Changes are immediately visible across all browser tabs/windows
- **No Backend Required**: Works perfectly in production without a server
- **Cross-Browser Sync**: Multiple users can share the same computer and see shared data

### Key Features

1. **Shared Data Service**: Custom service that synchronizes data across browser tabs
2. **Cross-Tab Communication**: Uses localStorage events for real-time updates
3. **Production Ready**: No server required, works on any static hosting
4. **Automatic Sync**: Data updates are automatically shared across all open tabs

## Deployment

### Static Hosting (Recommended)

Deploy to any static hosting service:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to:
   - Netlify
   - Vercel
   - GitHub Pages
   - Firebase Hosting
   - Any web server

### Local Network Sharing

To share with users on the same network:

1. Build and serve locally:
   ```bash
   npm run build
   npm run preview -- --host
   ```

2. Access from other devices using your IP address

## Usage

1. **Multi-Tab Testing**: Open the app in multiple browser tabs to see real-time sync
2. **Add People**: Manage the list of people who share expenses
3. **Add Expenses**: Any user can add expenses that everyone will see
4. **View Settlements**: See who owes money and who should receive money
5. **Monthly Tracking**: Switch between different months to track expenses over time

## Technical Details

- **Frontend**: React with Vite
- **Data Storage**: localStorage with cross-tab synchronization
- **Real-time Sync**: Custom SharedDataService using storage events
- **Production Ready**: No backend server required

## Data Sharing Mechanism

The app uses a sophisticated localStorage-based system:

1. **Shared Storage Key**: All data stored under a common key
2. **Timestamp Tracking**: Each update includes a timestamp
3. **Cross-Tab Events**: Storage events notify other tabs of changes
4. **Automatic Sync**: Periodic checks ensure data consistency

## Troubleshooting

- **Data Not Syncing**: Make sure you're using the same browser and localStorage is enabled
- **Multiple Users**: Each browser/device maintains its own data - perfect for roommate scenarios
- **Data Persistence**: Data persists until browser storage is cleared
- **Cross-Device Sharing**: For true cross-device sharing, consider deploying with a backend database