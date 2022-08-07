import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../constant/types';
import TopTabs from './TopTabs';
import CreatePostScreen from '../screens/post/CreatePostScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ShowFullImageScreen from '../screens/ShowFullImageScreen';
import ProfileScreen from '../screens/personal/ProfileScreen';
import CommentPostScreen from '../screens/post/CommentPostScreen';
import DetailPostScreen from '../screens/post/DetailPostScreen';
import EditPostScreen from '../screens/post/EditPostScreen';

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
      <Stack.Screen
        name={'DetailPostScreen'}
        component={DetailPostScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={'EditPostScreen'}
        component={EditPostScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
