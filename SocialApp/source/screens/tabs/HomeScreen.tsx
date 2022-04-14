import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';
import {BLACK, BLUE_GRAY_200, WHITE} from '../../constant/color';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../constant/types';
import PostItem from '../../components/PostItem';
import {BASE_URL, DEFAULT_AVATAR} from '../../constant/constants';
import {requestGetPost, updateListPost} from '../../feature/post/postSlice';
import {socket} from '../../socket/SocketClient';

interface HeaderProps {
  avatarUser: string;
  onPress: () => void;
}

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${WHITE};
  margin-bottom: ${HEIGHT / 100}px;
  padding-vertical: ${(HEIGHT / 100) * 2}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const AvatarUserImage = styled.Image`
  width: ${(WIDTH / 100) * 9}px;
  height: ${(WIDTH / 100) * 9}px;
  border-radius: ${(WIDTH / 100) * 5}px;
  resize-mode: cover;
`;

const CreatePostButton = styled.TouchableOpacity`
  flex: 1;
  margin-horizontal: ${(WIDTH / 100) * 2}px;
  border-radius: ${(WIDTH / 100) * 5}px;
  padding-vertical: ${HEIGHT / 100 / 1.25}px;
  border-width: 1px;
  border-color: ${BLUE_GRAY_200};
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const CreatePostText = styled.Text`
  font-size: ${normalize(12)}px;
  font-weight: 400;
  color: ${BLACK};
`;

const HeaderFlatList = (props: HeaderProps) => {
  return (
    <SearchContainer>
      <AvatarUserImage source={{uri: props.avatarUser}} />
      <CreatePostButton onPress={props.onPress}>
        <CreatePostText>Bạn đang nghĩ gì?</CreatePostText>
      </CreatePostButton>
    </SearchContainer>
  );
};

export default function HomeScreen() {
  const avatarUser = useAppSelector(state => state.auth.avatar);
  const userID = useAppSelector(state => state.auth.id);
  const [currentPage, setCurrentPage] = React.useState(1);
  const listPost = useAppSelector(state => state.post.listPost);
  const [totalPost, setTotalPost] = React.useState(1);
  const navigation = useNavigation<HomeScreenProps>();
  const dispatch = useAppDispatch();
  const [isRefresh, setIsRefresh] = React.useState(false);

  const onClickCreatePostButton = () => {
    navigation.navigate('CreatePostScreen');
  };

  const onClickUserOfPost = (uid: string) => {
    // navigation.navigate('Profile', {
    //   uid: uid,
    // });
  };

  const getListPost = async (page: number) => {
    const response = await dispatch(requestGetPost({page})).unwrap();
    if (response.status) {
      if (page === 1) {
        setTotalPost(response.total);
      }
      setCurrentPage(page);
    }
  };

  const onLoadMore = () => {
    if (listPost.length < totalPost) {
      dispatch(requestGetPost({page: currentPage + 1}));
    }
  };

  const onRefresh = () => {
    setIsRefresh(true);
    getListPost(1);
    setIsRefresh(false);
  };

  const renderItem = ({item}) => {
    return (
      <PostItem
        item={item}
        onClickUserOfPost={onClickUserOfPost}
        uid={userID}
      />
    );
  };

  React.useEffect(() => {
    getListPost(1);
  }, []);

  React.useEffect(() => {
    socket.on('updatePost', post => {
      dispatch(updateListPost({post}));
    });
    return () => {
      socket.off('updatePost');
      socket.disconnect();
    };
  }, []);

  return (
    <FlatList
      data={listPost}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      contentContainerStyle={{flexGrow: 1, backgroundColor: BLUE_GRAY_200}}
      ListHeaderComponent={() => (
        <HeaderFlatList
          onPress={onClickCreatePostButton}
          avatarUser={avatarUser ? avatarUser : DEFAULT_AVATAR}
        />
      )}
      refreshing={isRefresh}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
}
