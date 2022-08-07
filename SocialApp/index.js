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
} from '@notifee/react-native';
import {DEFAULT_AVATAR} from './source/constant/constants';

async function onMessageReceived(message) {
  const channelId = await createChannelID();
  if (message.data.type === 'MESSAGE') {
    const user = JSON.parse(message.data.user);
    notifee.displayNotification({
      title: message.data.title,
      body: message.data.body,
      android: {
        channelId: channelId,
        smallIcon: 'ic_small_icon',
        color: '#2979FF',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        largeIcon: user.avatar || DEFAULT_AVATAR,
        pressAction: {
          id: 'default',
          mainComponent: appName,
        },
      },
      data: message.data,
    });
  } else {
    notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId: channelId,
        smallIcon: 'ic_small_icon',
        color: '#2979FF',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        sound: 'default',
        pressAction: {
          id: 'default',
          mainComponent: appName,
        },
      },
      data: message.data,
    });
  }
}

const createChannelID = async () => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'messenger',
    vibration: true,
  });
  return channelId;
};

messaging().onMessage(onMessageReceived);

messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({type, detail}) => {});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
