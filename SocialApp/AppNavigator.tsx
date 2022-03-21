import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './source/navigation/AuthStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './source/constant/types';
import {useAppSelector} from './source/app/hook';
import SplashScreen from './source/screens/splash/SplashScreen';
import MainStack from './source/navigation/MainStack';
import {navigationRef} from './source/navigation/RootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const loadingSplash = useAppSelector(state => state.auth.isLoadingSplash);
  const existUser = useAppSelector(state => state.auth.existUser);
  return (
    <NavigationContainer ref={navigationRef}>
      {loadingSplash ? (
        <Stack.Navigator>
          <Stack.Screen
            name={'SplashScreen'}
            component={SplashScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : !existUser ? (
        <AuthStack />
      ) : (
        <MainStack />
      )}
    </NavigationContainer>
  );
}
