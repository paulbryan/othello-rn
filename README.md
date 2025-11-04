# Othello RN

A React Native mobile application built with Expo and TypeScript.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/paulbryan/othello-rn.git
cd othello-rn
```

2. Install dependencies:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

This will open the Expo Developer Tools in your browser. From here, you can:

- **Run on Android**: Press `a` or run `npm run android`
- **Run on iOS**: Press `i` or run `npm run ios` (macOS only)
- **Run on Web**: Press `w` or run `npm run web`
- **Scan QR code**: Use the Expo Go app on your phone to scan the QR code

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS required)
- `npm run web` - Run in web browser

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Platform**: [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

```
othello-rn/
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions and game logic
├── types/            # TypeScript type definitions
├── constants/        # App constants (colors, game settings)
├── assets/           # Images, fonts, and other static assets
├── .github/          # GitHub configuration
├── app.json          # Expo configuration
├── eas.json          # EAS Build configuration
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## 🚀 Building & Deployment

### Development Build

Create a development build for testing:

```bash
# Install EAS CLI globally (first time only)
npm install -g eas-cli

# Login to Expo account
eas login

# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile preview
```

### Production Build

Build for app store submission:

```bash
# Build for Google Play Store
eas build --platform android --profile production

# Build for Apple App Store
eas build --platform ios --profile production

# Build for both platforms
eas build --platform all --profile production
```

### Submitting to App Stores

```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to Apple App Store
eas submit --platform ios
```

### Over-the-Air (OTA) Updates

Push JS-only updates without rebuilding:

```bash
eas update --branch production --message "Your update message"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support, please open an issue in the GitHub repository.
