import * as React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import PostItem from '../../components/PostItem';
import {
  BLACK,
  BLUE_700,
  BLUE_900,
  BLUE_GRAY,
  BLUE_GRAY_200,
  GREY_600,
  LIGHT_BLUE,
  RED_A400,
  TRANSPARENT,
  WHITE,
} from '../../constant/color';
import {WIDTH, normalize, HEIGHT} from '../../constant/dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  interpolate,
  LightSpeedInLeft,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../constant/types';
import {useNavigation} from '@react-navigation/native';
import {DEFAULT_AVATAR, DEFAULT_COVER_IMAGE} from '../../constant/constants';
import {
  requestGetDataUser,
  requestUpdateAvatarUser,
  requestUpdateCoverImageUser,
} from '../../feature/user/userSlice';
import {checkUserFollowed, showAlert} from '../../ultilities/Ultilities';
import LoadingScreen from '../../components/LoadingScreen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import ListEmpty from '../../components/ListEmpty';
import {updateListFollow} from '../../feature/auth/authSlice';

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);
const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity);

interface HeaderProps {
  avatarUser: string;
  coverImage: string;
  userName: string;
  onPress: () => void;
  onShowImage: (uriImage: string) => void;
  canChangeAvatar: boolean;
  onChangeCoverImage: () => void;
  onGoBack: () => void;
  listFollow: Array<string>;
  listFollower: Array<string>;
  isFollowed: boolean;
  onClickFollow: () => void;
}

type ProfileScreenProps = StackNavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

interface ProfileProps {
  route: {
    params: {
      uid: string;
    };
  };
}

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const AvatarImageContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: ${(WIDTH / 100) * 15}px;
  left: ${(WIDTH / 100) * 4}px;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled.Image`
  width: ${(WIDTH / 100) * 30}px;
  height: ${(WIDTH / 100) * 30}px;
  border-radius: ${(WIDTH / 100) * 18}px;
  border-width: 5px;
  border-color: ${WHITE};
`;

const LastRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${HEIGHT / 100}px;
`;

const FollowContainer = styled.View`
  flex: 1;
  padding-horizontal: ${(WIDTH / 100) * 2}px;
`;

const FollowText = styled.Text`
  font-size: ${normalize(12)}px;
  font-weight: bold;
  text-align: left;
  color: ${BLACK};
  flex: 1;
`;

const FollowButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  padding-vertical: ${HEIGHT / 100 / 2}px;
  border-radius: ${WIDTH / 100}px;
  background-color: ${props => (props.isFollowed ? WHITE : BLUE_900)};
  border-width: 0.5px;
  border-color: ${props => (props.isFollowed ? BLUE_GRAY_200 : WHITE)};
`;

const FollowButtonText = styled.Text`
  margin-left: ${WIDTH / 100}px;
  font-size: ${normalize(12)}px;
  color: ${props => (props.isFollowed ? BLUE_900 : WHITE)};
  font-weight: bold;
`;

const HeaderContainer = styled.View`
  background-color: ${WHITE};
  margin-bottom: ${HEIGHT / 100}px;
`;

const RowHeaderContainer = styled.View`
  background-color: ${TRANSPARENT};
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${(WIDTH / 100) * 2}px;
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  left: 0;
  right: 0;
`;

const ButtonBack = styled.TouchableOpacity`
  width: ${(WIDTH / 100) * 8}px;
  height: ${(WIDTH / 100) * 8}px;
  justify-content: center;
  align-items: center;
`;

const ButtonChangeAvatar = styled.TouchableOpacity`
  width: ${(WIDTH / 100) * 8}px;
  height: ${(WIDTH / 100) * 8}px;
  border-radius: ${(WIDTH / 100) * 5}px;
  background-color: ${BLUE_GRAY};
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0px;
  top: ${(WIDTH / 100) * 20}px;
`;

const ButtonChangeCoverImage = styled.TouchableOpacity`
  width: ${(WIDTH / 100) * 8}px;
  height: ${(WIDTH / 100) * 8}px;
`;

const UserNameText = styled.Text`
  font-size: ${normalize(16)}px;
  font-weight: 700;
  color: ${BLACK};
  margin-vertical: ${HEIGHT / 100}px;
`;

const ModalContent = styled.View`
  border-radius: ${(WIDTH / 100) * 2}px;
  padding-vertical: ${(HEIGHT / 100) * 2}px;
  background-color: ${WHITE};
  min-height: ${(HEIGHT / 100) * 15}px;
`;

const IndicatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(HEIGHT / 100) * 2}px;
`;

const Indicator = styled.View`
  width: ${(WIDTH / 100) * 6}px;
  height: 4px;
  border-radius: ${(WIDTH / 100) * 2}px;
  background-color: ${BLACK};
`;

const RowContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonModalContainer = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TitleButtonModal = styled.Text`
  font-size: ${normalize(14)}px;
  font-weight: 700;
  margin-top: ${HEIGHT / 100}px;
`;

const HeaderFlatList = React.memo((props: HeaderProps) => {
  return (
    <HeaderContainer>
      <TouchableOpacity onPress={() => props.onShowImage(props.coverImage)}>
        <Animated.Image
          source={{uri: props.coverImage}}
          style={{
            width: WIDTH,
            height: WIDTH * 0.8,
            marginBottom: (WIDTH / 100) * 10,
          }}
          resizeMode="cover"
        />
        <RowHeaderContainer>
          <ButtonBack onPress={props.onGoBack}>
            <FontAwesome5
              name="arrow-left"
              size={(WIDTH / 100) * 5}
              color={WHITE}
            />
          </ButtonBack>
          {props.canChangeAvatar && (
            <ButtonChangeCoverImage onPress={props.onChangeCoverImage}>
              <FontAwesome5
                name="edit"
                size={(WIDTH / 100) * 5}
                color={WHITE}
              />
            </ButtonChangeCoverImage>
          )}
        </RowHeaderContainer>
      </TouchableOpacity>
      <AvatarImageContainer onPress={() => props.onShowImage(props.avatarUser)}>
        <AvatarImage source={{uri: props.avatarUser}} />
        {props.canChangeAvatar && (
          <ButtonChangeAvatar onPress={props.onPress}>
            <FontAwesome5
              name="user-edit"
              size={(WIDTH / 100) * 4}
              color={BLUE_700}
            />
          </ButtonChangeAvatar>
        )}
      </AvatarImageContainer>
      <LastRow>
        <UserNameText>{props.userName}</UserNameText>
        <FollowContainer>
          <FollowText>Đang theo dõi {props.listFollow.length} người</FollowText>
          <FollowText>{props.listFollower.length} người theo dõi</FollowText>
        </FollowContainer>
        {!props.canChangeAvatar && (
          <FollowButton
            isFollowed={props.isFollowed}
            onPress={props.onClickFollow}>
            <FontAwesome5
              name="user-plus"
              size={(WIDTH / 100) * 4}
              color={props.isFollowed ? BLUE_900 : WHITE}
            />
            <FollowButtonText isFollowed={props.isFollowed}>
              {props.isFollowed ? 'Bỏ theo dõi' : 'Theo dõi'}
            </FollowButtonText>
          </FollowButton>
        )}
      </LastRow>
    </HeaderContainer>
  );
});

export default function ProfileScreen(props: ProfileProps) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ProfileScreenProps>();
  const userId = useAppSelector(state => state.auth.id);
  const [userName, setUserName] = React.useState('');
  const [listPost, setListPost] = React.useState([]);
  const [userAvatar, setUserAvatar] = React.useState(null);
  const [coverImage, setCoverImage] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPost, setTotalPost] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVisibleModal, setIsVisibleModal] = React.useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = React.useState(false);
  const [listFollow, setListFollow] = React.useState([]);
  const [listFollower, setListFollower] = React.useState([]);
  const listFollowOfUser = useAppSelector(state => state.auth.listFollow);

  const scrollY = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, 100],
      [0, (WIDTH / 100) * 35],
    );
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.25]);

    return {
      opacity,
      transform: [
        {
          translateX,
        },
      ],
    };
  });

  const onGoBack = () => {
    navigation.goBack();
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onShowImage = (imageUri: string) => {
    Image.getSize(
      imageUri,
      (width, height) => {
        navigation.navigate('ShowFullImageScreen', {
          uriImage: imageUri,
          width,
          height,
        });
      },
      error => {
        showAlert(error.message, 'danger');
      },
    );
  };

  const onChangeAvatar = () => {
    setIsVisibleModal(true);
    setIsChangeAvatar(true);
  };

  const onChangeCoverImage = () => {
    setIsVisibleModal(true);
    setIsChangeAvatar(false);
  };

  const onCloseModal = () => {
    setIsVisibleModal(false);
  };

  const onOpenLibrary = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
    });
    if (response.didCancel) {
      return;
    } else if (response.errorCode) {
      showAlert(response.errorMessage, 'danger');
      return;
    }
    const image = {
      fileName: response.assets[0].fileName,
      type: response.assets[0].type,
      uri: response.assets[0].uri,
    };
    if (isChangeAvatar) {
      if (response?.assets) {
        setIsVisibleModal(false);
        onRequestChangeAvatar(image);
      }
    } else {
      if (response?.assets) {
        setIsVisibleModal(false);
        onRequestChangeCoverImage(image);
      }
    }
  };

  const onOpenCamera = async () => {
    const response = await launchCamera({
      mediaType: 'photo',
      cameraType: 'front',
    });
    if (response.didCancel) {
      return;
    } else if (response.errorCode) {
      showAlert(response.errorMessage, 'danger');
      return;
    }
    const image = {
      fileName: response.assets[0].fileName,
      type: response.assets[0].type,
      uri: response.assets[0].uri,
    };
    if (isChangeAvatar) {
      if (response?.assets) {
        setIsVisibleModal(false);

        onRequestChangeAvatar(image);
      }
    } else {
      if (response.assets) {
        setIsVisibleModal(false);
        onRequestChangeCoverImage(image);
      }
    }
  };

  const onRequestChangeAvatar = async (image: {
    fileName: string;
    type: string;
    uri: string;
  }) => {
    setIsLoading(true);
    const res = await dispatch(requestUpdateAvatarUser({image})).unwrap();
    if (res.status) {
      showAlert('Cập nhật ảnh đại diện thành công', 'success');
      setUserAvatar(res.avatar);
    }
    setIsLoading(false);
  };

  const onRequestChangeCoverImage = async (image: {
    fileName: string;
    type: string;
    uri: string;
  }) => {
    setIsLoading(true);
    const res = await dispatch(requestUpdateCoverImageUser({image})).unwrap();
    if (res.status) {
      showAlert('Cập nhật ảnh bìa thành công', 'success');
      setCoverImage(res.coverImage);
    }
    setIsLoading(false);
  };

  const onClickSendMessage = () => {
    if (userId === props.route.params.uid) {
      showAlert('Chắc năng chat với chính mình đang phát triển', 'info');
    } else {
      navigation.navigate('ChatScreen', {
        participantID: [userId, props.route.params.uid],
        friendName: userName,
        friendAvatar: userAvatar,
      });
    }
  };

  const getDataUser = async (page: number) => {
    setIsLoading(true);
    const response = await dispatch(
      requestGetDataUser({uid: props.route.params.uid, page: page}),
    ).unwrap();
    if (response.status) {
      if (page === 1) {
        setTotalPost(response.totalPost);
        setListPost(response.listPost);
        setUserAvatar(response.avatar);
        setUserName(response.name);
        setCoverImage(response.coverImage);
        setListFollow(response.listFollow);
        setListFollower(response.listFollower);
      } else {
        setListPost([...listPost, response.listPost]);
      }
      setCurrentPage(page);
    }
    setIsLoading(false);
  };

  const onLoadMore = () => {
    if (listPost.length < totalPost) {
      getDataUser(currentPage + 1);
    }
  };

  const onClickFollow = () => {
    dispatch(updateListFollow({friendID: props.route.params.uid}));
    const newListFollow = [...listFollow];
    newListFollow.push(userId);
    setListFollow(newListFollow);
  };

  const renderItem = ({item}) => {
    return <PostItem uid={userId} item={item} onClickUserOfPost={() => {}} />;
  };

  React.useEffect(() => {
    getDataUser(1);
    return () => {
      setListPost([]);
      setListFollow([]);
      setListFollower([]);
    };
  }, []);

  return (
    <Container>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FlatListAnimated
          onScroll={onScroll}
          data={listPost}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={renderItem}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{flexGrow: 1, backgroundColor: BLUE_GRAY}}
          ListEmptyComponent={ListEmpty}
          ListHeaderComponent={
            <HeaderFlatList
              canChangeAvatar={userId === props.route.params.uid}
              userName={userName}
              coverImage={coverImage ? coverImage : DEFAULT_COVER_IMAGE}
              avatarUser={userAvatar ? userAvatar : DEFAULT_AVATAR}
              onPress={onChangeAvatar}
              onShowImage={onShowImage}
              onChangeCoverImage={onChangeCoverImage}
              onGoBack={onGoBack}
              listFollow={listFollow}
              listFollower={listFollower}
              isFollowed={checkUserFollowed(userId, listFollow)}
              onClickFollow={onClickFollow}
            />
          }
        />
      )}
      <ButtonAnimated
        onPress={onClickSendMessage}
        style={[
          {
            width: (WIDTH / 100) * 13,
            height: (WIDTH / 100) * 13,
            backgroundColor: LIGHT_BLUE,
            borderRadius: (WIDTH / 100) * 7,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: (HEIGHT / 100) * 3,
            right: (WIDTH / 100) * 4,
          },
          buttonAnimatedStyle,
        ]}>
        <FontAwesome5
          name={'facebook-messenger'}
          color={WHITE}
          size={(WIDTH / 100) * 5}
        />
      </ButtonAnimated>
      <Modal
        isVisible={isVisibleModal}
        hasBackdrop={true}
        onBackdropPress={onCloseModal}
        style={{
          flex: 1,
          margin: 0,
          justifyContent: 'flex-end',
        }}
        useNativeDriver={false}>
        <ModalContent>
          <IndicatorContainer>
            <Indicator />
          </IndicatorContainer>
          <RowContainer>
            <ButtonModalContainer onPress={onOpenLibrary}>
              <FontAwesome5
                name="images"
                size={(WIDTH / 100) * 8}
                color={RED_A400}
              />
              <TitleButtonModal>Thư viện</TitleButtonModal>
            </ButtonModalContainer>
            <ButtonModalContainer onPress={onOpenCamera}>
              <FontAwesome5
                name="camera"
                size={(WIDTH / 100) * 8}
                color={RED_A400}
              />
              <TitleButtonModal>Máy ảnh</TitleButtonModal>
            </ButtonModalContainer>
          </RowContainer>
        </ModalContent>
      </Modal>
    </Container>
  );
}

// function areEqualsHeader(prevProps: HeaderProps, nextProps: HeaderProps) {
//   if (
//     prevProps.avatarUser === nextProps.avatarUser &&
//     prevProps.coverImage === nextProps.coverImage &&
//     prevProps.canChangeAvatar === nextProps.canChangeAvatar &&
//     prevProps.listFollow.length === nextProps.listFollow.length &&
//     prevProps.isFollowed === nextProps.isFollowed
//   ) {
//     return true;
//   }
//   return false;
// }
