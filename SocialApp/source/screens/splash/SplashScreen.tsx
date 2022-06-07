import * as React from 'react';
import {useAppDispatch} from '../../app/hook';
import {loadingSplash, updateExistUser} from '../../feature/auth/authSlice';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import {WHITE} from '../../constant/color';

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
      const data = JSON.parse(user);
      dispatch(updateExistUser(data));
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
