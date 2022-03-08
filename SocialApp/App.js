import React from 'react';
import {StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from './AppNavigator';
import {store} from './source/app/store';
import {WHITE} from './source/constant/color';
import FlashMessage from 'react-native-flash-message';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar animated={true} backgroundColor={WHITE} />
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
