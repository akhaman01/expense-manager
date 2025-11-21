# Firebase Setup for Cross-Device Sharing

## Quick Setup Steps

1. **Install Firebase**:
   ```bash
   npm install firebase
   ```

2. **Create Firebase Project**:
   - Go to https://console.firebase.google.com/
   - Click "Create a project"
   - Enable Realtime Database

3. **Get Config**:
   - Go to Project Settings > General
   - Copy the Firebase config object

4. **Update firebaseService.js**:
   Replace the config in `src/firebaseService.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
     projectId: "your-project-id"
   };
   ```

## How It Works

- **Toggle**: Check "Cross-Device Sharing" to enable Firebase
- **Room ID**: Each group gets a unique room ID (shown in header)
- **Share Room**: Give the room ID to other users to join the same expense group
- **Real-time**: All changes sync instantly across all devices

## Usage

1. One user enables cross-device sharing
2. Share the Room ID with other users
3. Other users enable sharing and enter the same Room ID
4. All expenses are now shared across devices!