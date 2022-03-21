import React from 'react';
import {StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from './AppNavigator';
import {store} from './source/app/store';
import {WHITE} from './source/constant/color';
import FlashMessage from 'react-native-flash-message';
import {fcmService} from './source/notifications/FCMService';
import {localNotificationService} from './source/notifications/LocalNotificationService';
import PushNotification from 'react-native-push-notification';
import * as RootNavigation from './source/navigation/RootNavigation';

export default function App() {
  React.useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      // console.log('[App] onRegister: ', token);
    }
    function onNotification(notify) {
      // console.log('[App] onNotification: ', notify);
      const options = {
        soundName: 'default',
        playSound: true,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }
    function onOpenNotification(notify) {
      if (
        !notify ||
        Object.keys(notify).length === 0 ||
        notify.android === undefined
      ) {
        return;
      }
      RootNavigation.navigate('DetailPostScreen', {idPost: '123'});
      alert('run notify: ' + JSON.stringify(notify));
    }

    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);

  React.useEffect(() => {
    PushNotification.channelExists('channel-id', function (exists) {
      if (exists) {
        return;
      } else {
        localNotificationService.createChannelNotify();
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor={WHITE}
          barStyle={'dark-content'}
        />
        <AppNavigator />
        <FlashMessage position="top" />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
