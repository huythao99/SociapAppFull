import * as React from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {
  BLACK,
  BLUE_A200,
  BLUE_A400,
  BLUE_GRAY,
  BLUE_GRAY_200,
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
import LoadingScreen from '../../components/LoadingScreen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {requestEditPost, updateListPost} from '../../feature/post/postSlice';
import {DEFAULT_AVATAR} from '../../constant/constants';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../constant/types';
import {showAlert} from '../../ultilities/Ultilities';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPostScreen'>;

type FormValues = {
  content: string;
};

type ImageType = {
  type: string;
  uri: string;
  fileName: string;
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

export default function EditPostScreen(props: Props) {
  const userAvatar = useAppSelector(state => state.auth.avatar);
  const userName = useAppSelector(state => state.auth.name);
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState<ImageType | null>(null);
  const [oldImage, setOldImage] = React.useState(props.route.params.urlImage);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      content: props.route.params.content || '',
    },
  });
  const dispatch = useAppDispatch();

  const translateY = useSharedValue(-HEIGHT);
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

  const onRemoveImage = () => {
    setOldImage(undefined);
    setImage(null);
  };

  const onOpenCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.6,
        cameraType: 'back',
      },
      response => {
        console.log(response);
        if (response.assets && response.assets[0]) {
          setImage({
            uri: response.assets[0].uri || '',
            width: response.assets[0].width || 0,
            height: response.assets[0].height || 0,
            fileName: response.assets[0].fileName || '',
            type: response.assets[0].type || '',
          });
          setOldImage(undefined);
        }
      },
    );
  };

  const onOpenLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.6,
      },
      response => {
        if (response.assets && response.assets[0]) {
          setImage({
            uri: response.assets[0].uri || '',
            width: response.assets[0].width || 0,
            height: response.assets[0].height || 0,
            fileName: response.assets[0].fileName || '',
            type: response.assets[0].type || '',
          });
          setOldImage(undefined);
        }
      },
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async data => {
    try {
      setIsLoading(true);

      const response = await dispatch(
        requestEditPost({
          image: image
            ? {
                fileName: image.fileName,
                uri: image.uri,
                type: image.type,
              }
            : null,
          content: data.content,
          oldImage: oldImage,
          postID: props.route.params.pid,
        }),
      ).unwrap();
      if (response?.status) {
        if (response.post) {
          dispatch(
            updateListPost({
              post: {
                ...response.post,
                id: response.post._id,
              },
            }),
          );
        }
        props.navigation.navigate('TopTabs', {
          screen: 'HomeScreen',
        });
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Container>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <HeaderContainer>
            <AvatarUserImage source={{uri: userAvatar || DEFAULT_AVATAR}} />
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
          {(image || oldImage) && (
            <ImageBackground
              source={{uri: image?.uri || oldImage}}
              style={styles.image}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onRemoveImage}>
                <FontAwesome5
                  name={'times-circle'}
                  size={(WIDTH / 100) * 7}
                  color={BLUE_GRAY_200}
                />
              </TouchableOpacity>
            </ImageBackground>
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

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: (WIDTH * 2) / 3,
    alignItems: 'flex-end',
  },
  cancelButton: {
    padding: (WIDTH / 100) * 2,
  },
});
