import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/tabs/HomeScreen';
import MessageScreen from '../screens/tabs/MessageScreen';
import PeopleScreen from '../screens/tabs/PeopleScreen';
import SettingScreen from '../screens/tabs/SettingScreen';
import NotifyScreen from '../screens/tabs/NotifyScreen';
import MyTabBar from '../components/MyTabBar';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        swipeEnabled: false,
      }}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="PeopleScreen" component={PeopleScreen} />
      <Tab.Screen name="MessageScreen" component={MessageScreen} />
      <Tab.Screen name="NotifyScreen" component={NotifyScreen} />
      <Tab.Screen name="SettingScreen" component={SettingScreen} />
    </Tab.Navigator>
  );
}
