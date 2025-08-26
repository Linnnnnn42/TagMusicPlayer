# Tag Music Player

A music player application based on tags built with React Native and Expo.

Read this in other languages: [English](README.md), [中文](README-zh.md).

## Features

### Music Playback
- Audio playback with play, pause, skip, and seek controls
- Background audio playback support

### Library Management
- Automatic music library scanning and organization
- Search and filter capabilities by title, artist, or lyrics
- [TO-DO] Tag-based music categorization
- [TO-DO] Favorites system for quick access to preferred tracks

### User Interface
- Dynamic color themes based on artwork / cover
- Bottom sheet player interface
- Floating player

### Localization
- Multi-language support (English and Chinese)

## TO-DO
### Features / Refactor
- Reduce Flickering
- Upgrade Cache System
- Encapsulate and use cpp language taglib library to improve reading efficiency
- Splash screen, more detailed loading prompts
- Keyboard handling
    - Move search button position to make it visible when search bar appears
- Replace search filter checkbox with SegmentedButtons
- Better pure music judgment
- Vibration feedback when switching between songs
- Fade between songs
- Complete accessibility support
### Known bugs
- Cannot read files with illegal characters such as ? # / [] {} space

## Building APK

To build an APK for Android, follow these steps:
1. Configure your Android development environment by following:
[Expo Android setup guide](https://docs.expo.dev/workflow/android-studio-emulator/),
[Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local)

2. Ensure you have all dependencies installed:
```shell
   cd ./music-app
   npm install
```

3. Generate your key by following:
[React Native: Signed apk android](https://reactnative.dev/docs/signed-apk-android)

4. Prebuild:
```shell
cd ./music-app
npx expo prebuild --platform android
```

5. Configure icon / splash screen assets (See [react-native-bootsplash: setup](https://github.com/zoontek/react-native-bootsplash?tab=readme-ov-file#setup) for details) :
```shell
cd ./music-app
npx react-native-bootsplash generate svgs/light-logo.svg ` 
--platforms=android,ios,web` 
--background=F5FCFF` --logo-width=100` 
--assets-output=assets/bootsplash ` 
--flavor=main` 
--html=public/index.html
```

6. Build the APK:
```shell
cd ./music-app/android
./gradlew assembleRelease
```

7. Get the output apk: app-release.apk
```shell
cd ./music-app/android/app/build/outputs/apk/release/
explorer .
```

## Acknowledgements

This project makes use of excellent open-source libraries and tools:

- [Babel](https://babeljs.io/) - JS compiler
- [Expo](https://expo.dev/) - Platform for making React Native development easier
- [Gorhom Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet) - Feature-rich bottom sheet component
- [i18next](https://www.i18next.com/) - Localization framework
- [Music Metadata](https://github.com/Borewit/music-metadata) - Parse metadata from audio files
- [Object Hash](https://github.com/puleos/object-hash) - Generate hashes from javascript objects in node and the browser
- [Prettier](https://prettier.io/) - Code formatter
- [React](https://github.com/facebook/react) - The library for React Native
- [React Native](https://reactnative.dev/) - The core framework for building the mobile application
- [React Native Awesome Slider](https://github.com/alantoa/react-native-awesome-slider) - Customizable slider component
- [React Native Bootsplash](https://github.com/zoontek/react-native-bootsplash) - Bootsplash screen for React Native apps
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - Native-backed gesture management API
- [React Native Image Colors](https://github.com/osamaqarem/react-native-image-colors) - Get prominent colors from an image
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) - Efficient, lightweight mobile key-value storage framework
- [React Native Paper](https://callstack.github.io/react-native-paper/) - Material Design components for React Native
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - React Native's Animated library reimplemented
- [React Native Safe Area Context](https://github.com/AppAndFlow/react-native-safe-area-context) - A module to handle safe area insets
- [React Native Text Ticker](https://github.com/deanhet/react-native-text-ticker) - Text auto-scrolling component for React Native
- [Typescript](https://www.typescriptlang.org/) - JS with syntax for types

## License

This project is licensed under the MIT License