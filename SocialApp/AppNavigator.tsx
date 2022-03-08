import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './source/navigation/AuthStack';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}
