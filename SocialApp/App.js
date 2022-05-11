import React from 'react';
import {StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from './AppNavigator';
import {store} from './source/app/store';
import {WHITE} from './source/constant/color';
import FlashMessage from 'react-native-flash-message';
import notifee, {EventType} from '@notifee/react-native';
import * as RootNavigation from './source/navigation/RootNavigation';

export default function App() {
  React.useEffect(() => {
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        const post = detail.notification.data.post
          ? JSON.parse(detail.notification.data.post)
          : null;
        const user = detail.notification.data.user
          ? JSON.parse(detail.notification.data.user)
          : null;
        switch (detail.notification.data.type) {
          case 'COMMENT':
            RootNavigation.navigate('CommentPostScreen', {
              postID: post.postID,
            });
            break;
          case 'FOLLOW':
            RootNavigation.navigate('ProfileScreen', {
              uid: user._id,
            });
            break;
          default:
            break;
        }
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
