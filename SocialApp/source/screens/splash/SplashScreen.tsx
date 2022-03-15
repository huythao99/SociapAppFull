import * as React from 'react';
import {useAppDispatch} from '../../app/hook';
import {loadingSplash, requestSignin} from '../../feature/auth/authSlice';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import {WHITE} from '../../constant/color';
import messaging from '@react-native-firebase/messaging';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${WHITE};
`;

export default function SplashScreen() {
  const dispatch = useAppDispatch();

  const hideSplashScreen = async () => {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      dispatch(loadingSplash());
    } else {
      const userInfo = JSON.parse(user);
      const fcmtoken = await messaging().getToken();
      setTimeout(() => {
        dispatch(
          requestSignin({
            email: userInfo.email,
            password: userInfo.password,
            fcmtoken: fcmtoken,
          }),
        );
      }, 2000);
    }
  };

  React.useEffect(() => {
    hideSplashScreen();
  }, []);

  return (
    <Container>
      <LottieView
        source={require('../../asset/lottie/88958-shopping-green.json')}
        autoPlay
        loop
      />
    </Container>
  );
}
