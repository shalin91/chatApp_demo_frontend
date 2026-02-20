# ChatApp Frontend (React Native)

A modern, real-time chat application built with React Native, Redux Toolkit, and Socket.io.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.io.
- **Authentication**: Secure login and signup with JWT and Formik/Yup validation.
- **Chat History**: Persisted message history retrieved from the backend.
- **Online Indicators**: Real-time tracking of users' online/offline status.
- **Typing Indicators**: Visual feedback when the person you're chatting with is typing.
- **Modern UI**: Clean and intuitive interface with Material Community Icons.

## Tech Stack

- **React Native**: Cross-platform mobile framework.
- **Redux Toolkit**: State management for auth and chat.
- **Socket.io-client**: Real-time WebSocket communication.
- **Axios**: API requests to the backend.
- **Formik & Yup**: Form handling and schema validation.
- **React Navigation**: Seamless screen transitions.
- **Async Storage**: Token and session persistence.

## Getting Started

### Prerequisites

- Node.js installed.
- React Native development environment set up (Android Studio/Xcode).
- Backend server running (see [Backend README](../backend/README.md)).

### Installation

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `BASE_URL` in `src/constants/index.js` to point to your backend IP address:
   ```javascript
   export const BASE_URL = 'http://YOUR_LOCAL_IP:5001/api';
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npx pod-install
npm run ios
```

## Project Structure

- `src/navigation`: App routing and stack definitions.
- `src/redux`: Redux slices and services for auth and chat.
- `src/screens`: UI components for Login, Signup, ChatList, and Chat.
- `src/constants`: App-wide constants including API URLs.

## Troubleshooting

- **Socket Connection**: Ensure your mobile device and backend server are on the same Wi-Fi network.
- **API Errors**: Double-check the `BASE_URL` in `src/constants/index.js`.
