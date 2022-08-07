import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './source/navigation/AuthStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './source/constant/types';
import {useAppSelector} from './source/app/hook';
import SplashScreen from './source/screens/splash/SplashScreen';
import MainStack from './source/navigation/MainStack';
import {navigationRef} from './source/navigation/RootNavigation';
import notifee from '@notifee/react-native';
import * as RootNavigation from './source/navigation/RootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const loadingSplash = useAppSelector(state => state.auth.isLoadingSplash);
  const existUser = useAppSelector(state => state.auth.existUser);
  const [notification, setNotification] = React.useState(null);

  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      setNotification(initialNotification);
    }
  }

  React.useEffect(() => {
    bootstrap();
  }, []);

  React.useEffect(() => {
    if (existUser && notification) {
      const post = notification.notification.data.post
        ? JSON.parse(notification.notification.data.post)
        : null;
      const user = notification.notification.data.user
        ? JSON.parse(notification.notification.data.user)
        : null;
      const conversationID = notification.notification.data.conversationID;

      switch (notification.notification.data.type) {
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
        case 'MESSAGE':
          RootNavigation.navigate('ChatScreen', {
            conversationID: conversationID,
          });
          break;
        default:
          break;
      }
    }
  }, [existUser]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {loadingSplash ? (
          <Stack.Screen
            name={'SplashScreen'}
            component={SplashScreen}
            options={{headerShown: false}}
          />
        ) : !existUser ? (
          <Stack.Screen name={'AuthNavigator'} component={AuthStack} />
        ) : (
          <Stack.Screen name={'MainNavigator'} component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
