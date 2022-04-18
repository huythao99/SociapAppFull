import React from 'react';
import {StatusBar, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from './AppNavigator';
import {store} from './source/app/store';
import {WHITE} from './source/constant/color';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  React.useEffect(() => {
    const getToken = async () => {
      console.log(await messaging().getToken());
    };

    getToken();
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
