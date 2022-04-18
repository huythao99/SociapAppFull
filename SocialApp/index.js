/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';

async function onMessageReceived(message) {
  const channelId = await createChannelID();
  notifee.displayNotification({
    title:
      '<p style="color: #4caf50;"><b>Styled HTMLTitle Background</span></p></b></p> &#128576;',
    body: 'The <p style="text-decoration: line-through">body cannn</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
    android: {
      channelId: channelId,
      smallIcon: 'ic_small_icon',
      color: '#2979FF',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    },
  });
}

const createChannelID = async () => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  return channelId;
};

messaging().onMessage(onMessageReceived);

messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  console.log('index.js');
  console.log(pressAction);
  console.log(notification);
  console.log(type);
  // Check if the user pressed the "Mark as read" action
  if (type === EventType.PRESS) {
    // Update external API
    console.log('run');

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
