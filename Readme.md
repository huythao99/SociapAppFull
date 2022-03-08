# Social App
## Client
### Setup enviroment
> Install Nodejs, python, openJDK8, android studio and simulator <br />
Details [here](https://reactnative.dev/docs/environment-setup). See instructions in section `React Native CLI Quickstart` (not `Expo CLI Quickstart`) <br />
<br />

### Library

#### React Native Navigation (6.x)
1. Install @react-navigation/native with command `npm install @react-navigation/native` (npm) or `yarn add @react-navigation/native` (yarn).
2. Install react-native-screens and react-native-safe-area-context with command `npm install react-native-screens react-native-safe-area-context` (npm) or `yarn add react-native-screens react-native-safe-area-context` (yarn).
3. Install @react-navigation/native-stack with command `npm install @react-navigation/native-stack
` (npm) or `yarn add @react-navigation/native-stack
` (yarn).
4. Install material-top-tabs and react-native-tab-view with command `npm install @react-navigation/material-top-tabs react-native-tab-view` (npm) or `yarn add @react-navigation/material-top-tabs react-native-tab-view
` (yarn).
5. Install react-native-page-view with command `npm install react-native-pager-view
` (npm) or `yarn add react-native-pager-view
` (yarn).

>*You can use `@react-navigation/stack` instead of `@react-navigation/native-stack` in case native stack fails. In that case, you must install `react native gesture handle`. But you may get a warning `[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system`, you can fix this by change `@react-navigation/stack` => `@react-navigation/native-stack`*. <br />
<br />
*See details: [step 1 and 2](https://reactnavigation.org/docs/getting-started), &nbsp;[step 3](https://reactnavigation.org/docs/hello-react-navigation), &nbsp; [step 4](https://reactnavigation.org/docs/tab-based-navigation), &nbsp; [step 5](https://reactnavigation.org/docs/stack-navigator)*
<br />

#### redux
> You can install with command `npm install @reduxjs/toolkit` (npm) or `yarn add @reduxjs/toolkit` (yarn). See more [here](https://redux.js.org/introduction/getting-started). This document also recommand using redux toolkit
<br />

#### redux toolkit
> The Redux Toolkit package is intended to be the standard way to write Redux logic. You can install with command `npm install @reduxjs/toolkit` (npm) or `yarn add @reduxjs/toolkit` (yarn). See more [here](https://redux-toolkit.js.org/introduction/getting-started)
<br />

#### styled component
> Styled component is modern of css. you can install with command `npm install --save styled-components` (npm) or `yarn add styled-components` (yarn). See more [here](https://styled-components.com/docs/basics)
<br />

#### react-hook-form
> This library will help you optimize performance, flexible, easy to use validation. You can install with command `npm install react-hook-form` (npm) or `yarn add react-hook-form` (yarn). See more [here](https://www.react-hook-form.com/get-started)
<br />

#### firebase
> Use firebase (cloud message) for notification feature. You can install with command `yarn add @react-native-firebase/app` (yarn) and `yarn add @react-native-firebase/messaging`. See more [here](https://rnfirebase.io/messaging/usage). You also should create project firebase. See more [here](https://rnfirebase.io/)

<br />

#### Async Storage

> This package helps you save data locally. You can install with command `npm install @react-native-async-storage/async-storage` (npm) or `yarn add @react-native-async-storage/async-storage` (yarn). See more [here](https://react-native-async-storage.github.io/async-storage/docs/install)

<br />

#### react-native-reanimated
> This library will help you create your animation with high performance. you can install with command `npm install react-native-reanimated` (npm) `yarn add react-native-reanimated` (yarn). See more [here](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)

#### react-native-flash-message
> You can install with command `npm install --save react-native-flash-message` (npm) or `yarn add react-native-flash-message` (yarn). You can see usage [here](https://www.npmjs.com/package/react-native-flash-message)
<br />

#### react-native-vector-icons
> You can install with command `npm install --save react-native-vector-icons` (npm) or `yarn add react-native-vector-icons` (yarn). This library will allow you to use icon. You can see more details [here](https://github.com/oblador/react-native-vector-icons)
<br />

## Server

### Setup enviroment
> Install Nodejs, and PostMan to test api

### Library

#### Express
> You can install with command `npm i express`. See more [here](https://www.npmjs.com/package/express)

#### Nodemon
> Nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected. You can install with command `npm i nodemon`. See more [here](https://www.npmjs.com/package/nodemon)

#### Dotenv
> Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. You can install with command `npm i dotenv`. See more [here](https://www.npmjs.com/package/dotenv)

#### joi
> The most powerful schema description language and data validator for JavaScript. You can install with command `npm i joi`. See more [here](https://www.npmjs.com/package/joi)

#### mongoose
> You can install with command `npm i mongoose`. See more [here](https://www.npmjs.com/package/mongoose)

#### jsonwebtoken
> You Can install with command `npm install jsonwebtoken`. See more [here](https://www.npmjs.com/package/jsonwebtoken)

#### bcryptjs
> This package used to increase security. You can install with command `npm i bcryptjs`. See more [here](https://www.npmjs.com/package/bcryptjs)

#### cors
> CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. You can install with command `npm i cors`. See more [here](https://www.npmjs.com/package/cors)