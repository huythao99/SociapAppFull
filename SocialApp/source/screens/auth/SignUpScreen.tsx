import React, {useState} from 'react';
import {View, Text, StatusBar} from 'react-native';
import {
  BLACK,
  BLUE_900,
  BLUE_A400,
  BLUE_GRAY_200,
  GREEN_600,
  RED_A400,
  WHITE,
} from '../../constant/color';
import styled from 'styled-components/native';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {Controller, useForm, SubmitHandler} from 'react-hook-form';
import {REGEX_EMAIL} from '../../constant/regex';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useAppDispatch} from '../../app/hook';
import {requestSignin, requestSignUp} from '../../feature/auth/authSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../constant/types';
import {useNavigation} from '@react-navigation/native';
import LoadingScreen from '../../components/LoadingScreen';
import messaging from '@react-native-firebase/messaging';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type SignUpScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'SignUpScreen'
>;

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const LoginImage = styled.Image`
  width: ${WIDTH}px;
  height: ${(WIDTH * 1.5) / 3}px;
  resize-mode: cover;
`;

const LoginContainer = styled.View`
  padding-vertical: ${HEIGHT / 100}px;
  margin-horizontal: ${(WIDTH / 100) * 5}px;
  margin-vertical: ${HEIGHT / 100}px;
`;

const Input = styled.TextInput`
  padding-vertical: ${HEIGHT / 100}px;
  border-bottom-width: 1px;
  border-bottom-color: ${BLUE_GRAY_200};
  font-size: ${normalize(14)}px;
  color: ${BLACK};
  margin-vertical: ${HEIGHT / 100}px;
`;

const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${HEIGHT / 100 / 2}px;
`;

const ErrorText = styled.Text`
  font-size: ${normalize(11)}px;
  font-weight: 400;
  color: ${RED_A400};
  margin-left: ${(WIDTH / 100) * 1.5}px;
`;

const SignUpButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-vertical: ${HEIGHT / 100}px;
  margin-vertical: ${(HEIGHT * 6) / 100}px;
  background-color: ${BLUE_A400};
  border-radius: ${WIDTH / 100}px;
`;

const ButtonText = styled.Text`
  font-size: ${normalize(15)}px;
  color: ${WHITE};
  font-weight: bold;
`;

const SignInButton = styled(SignUpButton)`
  margin-horizontal: ${(WIDTH * 10) / 100}px;
  background-color: ${GREEN_600};
`;

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<SignUpScreenProps>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setIsLoading(true);
    const fcmToken = await messaging().getToken();
    await dispatch(
      requestSignUp({
        name: data.name,
        email: data.email,
        password: data.password,
        fcmtoken: fcmToken,
      }),
    );
    setIsLoading(false);
  };

  const onSignIn = () => {
    navigation.navigate('SignInScreen');
  };

  return (
    <Container>
      <StatusBar animated={true} backgroundColor={BLUE_900} />
      <LoginImage source={require('../../asset/LoginFacebook.jpg')} />
      <LoginContainer>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập tên của bạn',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <Input
                  placeholder={'Name'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="words"
                />
                {errors.name && (
                  <ErrorContainer>
                    <FontAwesome5
                      color={RED_A400}
                      name={'exclamation-circle'}
                      size={(WIDTH / 100) * 3}
                    />
                    <ErrorText>{errors.name?.message}</ErrorText>
                  </ErrorContainer>
                )}
              </>
            );
          }}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập email của bạn',
            },
            pattern: {
              value: REGEX_EMAIL,
              message: 'Vui lòng nhập email đúng định dạng',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <Input
                  placeholder={'Email'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType={'email-address'}
                  autoCapitalize="none"
                />
                {errors.email && (
                  <ErrorContainer>
                    <FontAwesome5
                      color={RED_A400}
                      name={'exclamation-circle'}
                      size={(WIDTH / 100) * 3}
                    />
                    <ErrorText>{errors.email?.message}</ErrorText>
                  </ErrorContainer>
                )}
              </>
            );
          }}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập mật khẩu của bạn',
            },
            minLength: {
              value: 6,
              message: 'Mật khẩu trong khoảng tử 6 - 32 ký tự',
            },
            maxLength: {
              value: 32,
              message: 'Mật khẩu trong khoảng tử 6 - 32 ký tự',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <Input
                  placeholder={'Mật khẩu'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
                {errors.password && (
                  <ErrorContainer>
                    <FontAwesome5
                      color={RED_A400}
                      name={'exclamation-circle'}
                      size={(WIDTH / 100) * 3}
                    />
                    <ErrorText>{errors.password?.message}</ErrorText>
                  </ErrorContainer>
                )}
              </>
            );
          }}
        />
        <SignUpButton onPress={handleSubmit(onSubmit)}>
          <ButtonText>Tạo tài khoản mới</ButtonText>
        </SignUpButton>
        <SignInButton onPress={onSignIn}>
          <ButtonText>Đăng nhập</ButtonText>
        </SignInButton>
      </LoginContainer>
      {isLoading && <LoadingScreen />}
    </Container>
  );
}
