import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/tabs/HomeScreen';
import MessageScreen from '../screens/tabs/MessageScreen';
import PeopleScreen from '../screens/tabs/PeopleScreen';
import SettingScreen from '../screens/tabs/SettingScreen';
import NotifyScreen from '../screens/tabs/NotifyScreen';
import {useAppSelector} from '../app/hook';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {normalize, WIDTH} from '../constant/dimensions';
import {BLUE_A400, BLUE_GRAY_200, RED_A400, WHITE} from '../constant/color';
import styled from 'styled-components/native';
import {View} from 'react-native';

const Tab = createMaterialTopTabNavigator();

const NumberContainer = styled.View`
  width: ${(WIDTH / 100) * 5}px;
  height: ${(WIDTH / 100) * 5}px;
  align-items: center;
  justify-content: center;
  border-radius: ${(WIDTH / 100) * 4}px;
  background-color: ${RED_A400};
`;

const NumberText = styled.Text`
  font-size: ${normalize(11)}px;
  color: ${WHITE};
  font-weight: bold;
`;

export default function TopTabs() {
  const totalConversationNotRead = useAppSelector(
    state => state.conversation.totalConversationNotRead,
  );
  const totalNotifiNotRead = useAppSelector(
    state => state.notify.totalNotificationNotRead,
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarShowIcon: true,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome5
                name={'home'}
                size={(WIDTH / 100) * 5.5}
                color={focused ? BLUE_A400 : BLUE_GRAY_200}
                solid={focused ? true : false}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="PeopleScreen"
        component={PeopleScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome5
                name={'user-friends'}
                size={(WIDTH / 100) * 5.5}
                color={focused ? BLUE_A400 : BLUE_GRAY_200}
                solid={focused ? true : false}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome5
                name={'facebook-messenger'}
                size={(WIDTH / 100) * 5.5}
                color={focused ? BLUE_A400 : BLUE_GRAY_200}
                solid={focused ? true : false}
              />
            );
          },
          tabBarBadge: () =>
            totalConversationNotRead === 0 ? null : (
              <NumberContainer>
                <NumberText>
                  {totalConversationNotRead > 9
                    ? '9+'
                    : totalConversationNotRead}
                </NumberText>
              </NumberContainer>
            ),
        }}
      />
      <Tab.Screen
        name="NotifyScreen"
        component={NotifyScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome5
                name={'bell'}
                size={(WIDTH / 100) * 5.5}
                color={focused ? BLUE_A400 : BLUE_GRAY_200}
                solid={focused ? true : false}
              />
            );
          },
          tabBarBadge: () =>
            totalNotifiNotRead === 0 ? null : (
              <NumberContainer>
                <NumberText>
                  {totalNotifiNotRead > 9 ? '9+' : totalNotifiNotRead}
                </NumberText>
              </NumberContainer>
            ),
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome5
                name={'bars'}
                size={(WIDTH / 100) * 5.5}
                color={focused ? BLUE_A400 : BLUE_GRAY_200}
                solid={focused ? true : false}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
