import * as React from 'react';
import {useAppDispatch} from '../../app/hook';
import {loadingSplash, requestSignin} from '../../feature/auth/authSlice';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const dispatch = useAppDispatch();

  const hideSplashScreen = async () => {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      dispatch(loadingSplash());
    }
    const userInfo = JSON.parse(user);
    setTimeout(() => {
      dispatch(
        requestSignin({email: userInfo.email, password: userInfo.password}),
      );
    }, 2000);
  };

  React.useEffect(() => {
    hideSplashScreen();
  }, []);

  return (
    <LottieView
      source={require('../../asset/lottie/88958-shopping-green.json')}
      autoPlay
      loop
    />
  );
}
