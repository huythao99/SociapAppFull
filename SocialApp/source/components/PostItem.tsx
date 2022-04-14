import * as React from 'react';
import styled from 'styled-components/native';
import {HEIGHT, normalize, WIDTH} from '../constant/dimensions';
import {
  BLACK,
  BLUE_A200,
  BLUE_GRAY,
  BLUE_GRAY_200,
  GREY_700,
  LIGHT_BLUE_A700,
  WHITE,
} from '../constant/color';
import {showAlert, timeAgo} from '../ultilities/Ultilities';
import {Image, TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useAppDispatch} from '../app/hook';
// import {requestLikePost} from '../features/post/postSlice';
import {useNavigation} from '@react-navigation/native';
import {PostItem as PostItemType, RootStackParamList} from '../constant/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {DEFAULT_AVATAR} from '../constant/constants';
import {requestLikePost} from '../feature/post/postSlice';
import Animated, {
  LightSpeedInLeft,
  SequencedTransition,
} from 'react-native-reanimated';

interface PostItemProps {
  item: PostItemType;
  uid: string;
  onClickUserOfPost: (uid: string) => void;
}

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

type AlignSelfProps = {
  position: 'flex-start' | 'flex-end';
};

type ReactionButton = {
  isLiked: Boolean;
};

const Container = styled.View`
  margin-vertical: ${HEIGHT / 100}px;
  padding-top: ${HEIGHT / 100}px;
  width: 100%;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  align-items: flex-start;
`;

const UserContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
`;

const UserAvatarImage = styled.Image`
  width: ${(WIDTH / 100) * 11}px;
  height: ${(WIDTH / 100) * 11}px;
  border-radius: ${(WIDTH / 100) * 6}px;
  resize-mode: cover;
  margin-right: ${(WIDTH / 100) * 2}px;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
`;

const TimeCreatedPostText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(11)}px;
  color: ${BLUE_GRAY_200};
`;

const ContentTextButton = styled.TouchableOpacity`
  margin-vertical: ${HEIGHT / 100}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ContentText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
`;

const ContentImageButton = styled.TouchableOpacity`
  margin-vertical: ${HEIGHT / 100}px;
`;
const ContentImage = styled.Image`
  width: ${WIDTH}px;
  height: ${(WIDTH * 9) / 10}px;
  resize-mode: cover;
`;

const InfoReactionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  margin-vertical: ${HEIGHT / 100}px;
`;

const InfoReactionWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: ${(props: AlignSelfProps) => props.position};
`;

const InfoReactionText = styled.Text`
  font-size: ${normalize(12)}px;
  color: ${GREY_700};
  margin-left: ${(WIDTH / 100) * 2}px;
`;

const ReactionButtonContainer = styled.View`
  flex-direction: row;
  padding-vertical: ${HEIGHT / 100}px;
  border-top-width: 1px;
  border-color: ${BLUE_GRAY};
  align-items: center;
`;

const ReactionButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ReactionText = styled.Text`
  font-size: ${normalize(12)}px;
  color: ${(props: ReactionButton) =>
    props.isLiked ? LIGHT_BLUE_A700 : GREY_700};
  margin-left: ${(WIDTH / 100) * 2}px;
`;

function PostItem(props: PostItemProps) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeScreenProps>();
  const [timer, setTimer] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [numOfLike, setNumOfLike] = React.useState(0);

  const onLike = async () => {
    if (isLiked) {
      setNumOfLike(numOfLike - 1);
    } else {
      setNumOfLike(numOfLike + 1);
    }
    setIsLiked(!isLiked);

    let newTimer = timer;
    if (newTimer) {
      clearTimeout(newTimer);
    }

    newTimer = setTimeout(() => {
      dispatch(requestLikePost({postID: props.item._id}));
    }, 1500);

    setTimer(newTimer);
  };

  const onNavigateCommentScreen = () => {
    navigation.navigate('CommentPostScreen', {postID: props.item._id});
  };

  const onShowImage = () => {
    Image.getSize(
      props.item.uriImage,
      (width, height) => {
        navigation.navigate('ShowFullImageScreen', {
          uriImage: props.item.uriImage,
          width,
          height,
        });
      },
      error => {
        showAlert(error.message, 'danger');
      },
    );
  };

  React.useEffect(() => {
    setIsLiked(
      props.item.listUserLike.findIndex(item => item === props.uid) !== -1,
    );
    setNumOfLike(props.item.listUserLike.length);
  }, []);

  return (
    <Animated.View
      entering={LightSpeedInLeft.duration(400)}
      layout={SequencedTransition}
      style={{
        marginVertical: HEIGHT / 100,
        paddingTop: HEIGHT / 100,
        width: '100%',
        backgroundColor: WHITE,
      }}>
      <HeaderContainer>
        <UserContainer
          onPress={() => props.onClickUserOfPost(props.item.creater._id)}>
          <UserAvatarImage
            source={{uri: props.item.creater.avatar || DEFAULT_AVATAR}}
          />
          <View>
            <UserNameText>{props.item.creater.name}</UserNameText>
            <TimeCreatedPostText>
              {timeAgo(props.item.timeCreate)}
            </TimeCreatedPostText>
          </View>
        </UserContainer>
        <TouchableOpacity>
          <FontAwesome5 name={'ellipsis-h'} size={(WIDTH / 100) * 4.5} />
        </TouchableOpacity>
      </HeaderContainer>
      <ContentTextButton>
        <ContentText>{props.item.content}</ContentText>
      </ContentTextButton>
      {props.item.uriImage && (
        <ContentImageButton onPress={onShowImage}>
          <ContentImage source={{uri: props.item.uriImage}} />
        </ContentImageButton>
      )}
      <InfoReactionContainer>
        {numOfLike > 0 && (
          <InfoReactionWrap position={'flex-start'}>
            <FontAwesome5
              size={(WIDTH / 100) * 4.5}
              color={BLUE_A200}
              name={'thumbs-up'}
              solid={true}
            />
            <InfoReactionText>{numOfLike} lượt thích</InfoReactionText>
          </InfoReactionWrap>
        )}
        {props.item.listComment.length > 0 && (
          <InfoReactionWrap
            position={'flex-end'}
            onPress={onNavigateCommentScreen}>
            <InfoReactionText>
              {props.item.listComment.length} bình luận
            </InfoReactionText>
          </InfoReactionWrap>
        )}
      </InfoReactionContainer>
      <ReactionButtonContainer>
        <ReactionButton onPress={onLike}>
          <FontAwesome5
            size={(WIDTH / 100) * 4.5}
            color={isLiked ? LIGHT_BLUE_A700 : GREY_700}
            name={'thumbs-up'}
            solid={isLiked}
          />
          <ReactionText isLiked={isLiked}>Thích</ReactionText>
        </ReactionButton>
        <ReactionButton onPress={onNavigateCommentScreen}>
          <FontAwesome5
            size={(WIDTH / 100) * 4.5}
            color={GREY_700}
            name={'comment'}
          />
          <ReactionText>Bình luận</ReactionText>
        </ReactionButton>
        <ReactionButton>
          <FontAwesome5
            size={(WIDTH / 100) * 4.5}
            color={GREY_700}
            name={'share'}
          />
          <ReactionText>Chia sẻ</ReactionText>
        </ReactionButton>
      </ReactionButtonContainer>
    </Animated.View>
  );
}

export default React.memo(PostItem);
