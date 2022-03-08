import * as React from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {
  BLACK,
  BLUE_A200,
  BLUE_A400,
  BLUE_GRAY,
  GREEN_500,
  LIGHT_BLUE_A700,
  RED_500,
  RED_A400,
  WHITE,
  YELLOW_700,
} from '../../constant/color';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
// import {requestCreatePost} from '../../features/post/postSlice';
import {useNavigation} from '@react-navigation/native';
import LoadingScreen from '../../components/LoadingScreen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showAlert} from '../../ultilities/Ultilities';

type FormValues = {
  content: string;
};

type ImageProps = {
  width: number;
  height: number;
};

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  margin-vertical: ${(HEIGHT / 100) * 2}px;
`;

const AvatarUserImage = styled.Image`
  width: ${(WIDTH / 100) * 12}px;
  height: ${(WIDTH / 100) * 12}px;
  border-radius: ${(WIDTH / 100) * 7}px;
  resize-mode: cover;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
  margin-left: ${(WIDTH / 100) * 2}px;
`;

const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${HEIGHT / 100 / 2}px;
  margin-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ErrorText = styled.Text`
  font-size: ${normalize(11)}px;
  font-weight: 400;
  color: ${RED_A400};
  margin-left: ${(WIDTH / 100) * 1.5}px;
`;

const InputText = styled.TextInput`
  width: 100%;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${HEIGHT / 100}px;
  font-size: ${normalize(18)}px;
  min-height: ${(HEIGHT / 100) * 8}px;
`;

const ContentImage = styled.Image`
  width: ${WIDTH}px;
  height: ${(props: ImageProps) => (WIDTH * props.height) / props.width}px;
`;

const BottomContainer = styled.View`
  padding-top: ${HEIGHT / 100}px;
`;

const NextButton = styled.TouchableOpacity`
  width: ${(WIDTH / 100) * 12}px;
  height: ${(WIDTH / 100) * 12}px;
  border-radius: ${(WIDTH / 100) * 6}px;
  justify-content: center;
  align-items: center;
  background-color: ${LIGHT_BLUE_A700};
  margin-vertical: ${HEIGHT / 100}px;
  align-self: flex-end;
  margin-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ListBottomButtonContainer = styled.View`
  flex-direction: row;
  align-item: center;
  border-top-width: 1px;
  border-top-color: ${BLUE_GRAY};
`;

const BottomButton = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: ${(HEIGHT / 100) * 1.5}px;
  align-items: center;
`;

const IconContainer = styled.View`
  flex: 0.1;
`;

const SheetButton = styled(BottomButton)`
  flex-direction: row;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${BLUE_GRAY};
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ContentButtonText = styled.Text`
  font-size: ${normalize(14)}px;
  margin-left: ${(WIDTH / 100) * 2}px;
  color: ${BLACK};
  flex: 1;
`;

export default function CreatePostScreen() {
  const userAvatar = useAppSelector(state => state.auth.avatar);
  const userName = useAppSelector(state => state.auth.name);
  const uid = useAppSelector(state => state.auth.id);
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const translateY = useSharedValue((HEIGHT / 100) * 10);
  const context = useSharedValue({y: 0});

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      if (translateY.value < (-HEIGHT / 100) * 30) {
        translateY.value = withTiming(-HEIGHT);
      } else if (translateY.value < 0) {
        translateY.value = withSpring(0);
      } else if (translateY.value > (HEIGHT / 100) * 15) {
        translateY.value = withTiming(HEIGHT);
      }
    });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
      position: 'absolute',
      paddingVertical: (HEIGHT / 100) * 2,
      bottom: 0,
      width: '100%',
      backgroundColor: WHITE,
    };
  });

  const onFocus = () => {
    translateY.value = withTiming(HEIGHT);
  };
  const onOpenCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.9,
        cameraType: 'back',
      },
      response => {
        setImage({
          uri: response.assets[0].uri,
          width: response.assets[0].width,
          height: response.assets[0].height,
        });
      },
    );
  };

  const onOpenLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.9,
      },
      response => {
        if (response.assets) {
          setImage({
            uri: response.assets[0].uri,
            width: response.assets[0].width,
            height: response.assets[0].height,
          });
        }
      },
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async data => {
    // try {
    //   const response = await dispatch(
    //     requestCreatePost({
    //       uid: uid,
    //       userName: userName,
    //       userAvatar: userAvatar,
    //       uriImage: image ? image.uri : null,
    //       content: data.content,
    //       uriVideo: null,
    //     }),
    //   ).unwrap();
    //   if (response?.status) {
    //     navigation.goBack();
    //   }
    // } catch (error) {
    //   showAlert(error.message, 'danger');
    // }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Container>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <HeaderContainer>
            <AvatarUserImage source={{uri: userAvatar}} />
            <UserNameText>{userName}</UserNameText>
          </HeaderContainer>
          <Controller
            name="content"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Nội dung không được bỏ trống',
              },
            }}
            render={({field: {value, onChange}}) => {
              return (
                <>
                  {errors.content && (
                    <ErrorContainer>
                      <FontAwesome5
                        color={RED_A400}
                        name={'exclamation-circle'}
                        size={(WIDTH / 100) * 3}
                      />
                      <ErrorText>{errors.content?.message}</ErrorText>
                    </ErrorContainer>
                  )}
                  <InputText
                    value={value}
                    onChangeText={onChange}
                    placeholder={'Bạn đang nghĩ gì?'}
                    multiline={true}
                    onFocus={onFocus}
                  />
                </>
              );
            }}
          />
          {image && (
            <ContentImage
              source={{uri: image.uri}}
              width={image.width}
              height={image.height}
            />
          )}
        </ScrollView>
        <BottomContainer>
          <NextButton onPress={handleSubmit(onSubmit)}>
            <FontAwesome5
              name={'arrow-right'}
              color={WHITE}
              size={(WIDTH / 100) * 4.5}
            />
          </NextButton>
          <ListBottomButtonContainer>
            <BottomButton onPress={onOpenLibrary}>
              <FontAwesome5
                name={'images'}
                color={GREEN_500}
                size={(WIDTH / 100) * 6}
              />
            </BottomButton>
            <BottomButton onPress={onOpenCamera}>
              <FontAwesome5
                name={'camera'}
                color={BLUE_A200}
                size={(WIDTH / 100) * 6}
              />
            </BottomButton>
            <BottomButton>
              <FontAwesome5
                name={'video'}
                color={RED_A400}
                size={(WIDTH / 100) * 6}
              />
            </BottomButton>
          </ListBottomButtonContainer>
        </BottomContainer>
        <GestureDetector gesture={gesture}>
          <Animated.View style={animatedStyle}>
            <SheetButton onPress={onOpenLibrary}>
              <IconContainer>
                <FontAwesome5
                  name={'images'}
                  color={GREEN_500}
                  size={(WIDTH / 100) * 5}
                />
              </IconContainer>
              <ContentButtonText>Ảnh</ContentButtonText>
            </SheetButton>
            <SheetButton onPress={onOpenCamera}>
              <IconContainer>
                <FontAwesome5
                  name={'camera'}
                  color={BLUE_A200}
                  size={(WIDTH / 100) * 5}
                />
              </IconContainer>
              <ContentButtonText>Camera</ContentButtonText>
            </SheetButton>
            <SheetButton>
              <IconContainer>
                <FontAwesome5
                  name={'video'}
                  color={RED_A400}
                  size={(WIDTH / 100) * 5}
                />
              </IconContainer>
              <ContentButtonText>Video</ContentButtonText>
            </SheetButton>
            <SheetButton>
              <IconContainer>
                <FontAwesome5
                  name={'map-marker-alt'}
                  color={RED_500}
                  size={(WIDTH / 100) * 5}
                />
              </IconContainer>
              <ContentButtonText>Check in</ContentButtonText>
            </SheetButton>
            <SheetButton>
              <IconContainer>
                <FontAwesome5
                  name={'smile-beam'}
                  color={YELLOW_700}
                  size={(WIDTH / 100) * 5}
                />
              </IconContainer>
              <ContentButtonText>Cảm xúc/Hoạt động</ContentButtonText>
            </SheetButton>
            <SheetButton>
              <IconContainer>
                <FontAwesome5
                  name={'user-tag'}
                  color={BLUE_A400}
                  size={(WIDTH / 100) * 5}
                />
              </IconContainer>
              <ContentButtonText>Gắn thẻ người khác</ContentButtonText>
            </SheetButton>
            <SheetButton>
              <IconContainer>
                <FontAwesome5
                  name={'microphone'}
                  color={RED_A400}
                  size={(WIDTH / 100) * 5}
                />
              </IconContainer>
              <ContentButtonText>Tổ chức buổi H{'&'}Đ</ContentButtonText>
            </SheetButton>
          </Animated.View>
        </GestureDetector>
        {isLoading && <LoadingScreen />}
      </Container>
    </GestureHandlerRootView>
  );
}
