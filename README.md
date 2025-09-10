# HomeGameAdvantage by MixedMindStudios

A gamified bartending education app built with React Native and Expo.

## 🎯 MVP Features
- **Onboarding + Auth**: Email/password authentication
- **Bottom Navigation**: Home, Lessons, Vault, Profile, Settings
- **XP System**: Earn 15 XP per completed lesson with progress tracking
- **Vault System**: Unlock recipes and content at 1000 XP
- **Quiz Lessons**: 3-question lessons with immediate feedback

## 🛠 Tech Stack
- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Firebase (Auth + Firestore)
- **Navigation**: React Navigation v6
- **State Management**: React Context + hooks

## 📁 Project Structure
```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components (Home, Lessons, etc.)
├── services/       # Firebase and API services
├── types/          # TypeScript type definitions
├── utils/          # Helper functions and constants
└── store/          # Global state management
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio

### Installation
```bash
cd HomeGameAdvantage
npm install
```

### Running the App
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator  
npm run android

# Run in web browser
npm run web
```

### Testing
```bash
# Test that the app boots without errors
npm start
# Press 'i' for iOS simulator or 'a' for Android
# Verify the app loads with "Open up App.js to start working on your app!"
```

## 📱 Current Status
- ✅ Project setup with TypeScript
- ⏳ Navigation setup
- ⏳ Firebase configuration
- ⏳ Authentication flow
- ⏳ XP system implementation