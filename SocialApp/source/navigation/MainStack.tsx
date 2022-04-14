import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../constant/types';
import TopTabs from './TopTabs';
import CreatePostScreen from '../screens/post/CreatePostScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import DetailPost from '../screens/post/DetailPostScreen';
import ShowFullImageScreen from '../screens/ShowFullImageScreen';
import ProfileScreen from '../screens/personal/ProfileScreen';
import CommentPostScreen from '../screens/post/CommentPostScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'TopTabs'}
        component={TopTabs}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={'CreatePostScreen'}
        component={CreatePostScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={'ChatScreen'}
        component={ChatScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={'DetailPostScreen'}
        component={DetailPost}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={'ShowFullImageScreen'}
        component={ShowFullImageScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={'ProfileScreen'}
        component={ProfileScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={'CommentPostScreen'}
        component={CommentPostScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
