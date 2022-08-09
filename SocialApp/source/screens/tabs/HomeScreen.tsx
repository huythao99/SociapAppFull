import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import styled from 'styled-components/native';
import {FlatList, ScrollView, StyleSheet} from 'react-native';
import {
  BLACK,
  BLUE_A400,
  BLUE_GRAY_200,
  TRANSPARENT,
  WHITE,
} from '../../constant/color';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  PostItem as PostInterface,
  RootStackParamList,
} from '../../constant/types';
import PostItem from '../../components/PostItem';
import {DEFAULT_AVATAR, REPORT_TYPE} from '../../constant/constants';
import {
  requestGetPost,
  requestReportPost,
  updateListPost,
} from '../../feature/post/postSlice';
import {socket} from '../../socket/SocketClient';
import ListEmpty from '../../components/ListEmpty';
import LoadingScreen from '../../components/LoadingScreen';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {showAlert} from '../../ultilities/Ultilities';

interface HeaderProps {
  avatarUser: string;
  onPress: () => void;
}

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

type ChooseProps = {
  isChoose: boolean;
};

type SubmitButton = {
  isDisable: boolean;
};

const Container = styled.View`
  flex: 1;
`;

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

const ModalOptionContainer = styled.View`
  border-top-left-radius: ${(WIDTH / 100) * 4}px;
  border-top-right-radius: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${HEIGHT / 100}px;
  max-height: ${(HEIGHT / 100) * 30}px;
  background-color: ${WHITE};
`;

const ModalOptionReportContainer = styled.View`
  padding-vertical: ${HEIGHT / 100}px;
  flex: 1
  background-color: ${WHITE};
`;

const ModalIndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  padding-vertical: ${HEIGHT / 100}px;
`;

const ModalReportHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: ${HEIGHT / 100}px;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ModalReportHeaderText = styled.Text`
  font-size: ${normalize(18)}px;
  font-weight: bold;
  color: ${BLACK};
`;

const CancelButton = styled.TouchableOpacity`
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  padding-vertical: ${HEIGHT / 100}px;
`;

const ModalIndicator = styled.View`
  width: ${(WIDTH / 100) * 8}px;
  height: ${HEIGHT / 100 / 2}px;
  border-radius: ${(WIDTH / 100) * 2}px;
  background-color: ${BLUE_GRAY_200};
`;

const OptionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${(HEIGHT / 100) * 2}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const OptionContentText = styled.Text`
  flex: 1;
  font-size: ${normalize(14)}px;
  font-weight: bold;
  color: ${BLACK};
`;

const ChooseContainer = styled.View`
  border-width: 1px;
  border-color: ${BLACK};
  width: ${(WIDTH / 100) * 6}px;
  height: ${(WIDTH / 100) * 6}px;
  border-radius: ${(WIDTH / 100) * 3}px;
  justify-content: center;
  align-items: center;
`;

const Choose = styled.View`
  width: ${(WIDTH / 100) * 4.5}px;
  height: ${(WIDTH / 100) * 4.5}px;
  border-radius: ${(WIDTH / 100) * 3}px;
  background-color: ${(props: ChooseProps) =>
    props.isChoose ? BLUE_A400 : WHITE};
`;

const InputContentContainer = styled.View`
  flex-direction: row;
  margin-horizontal: ${(WIDTH / 100) * 4}px;
  border-bottom-width: 1px;
  border-bottom-color: ${BLUE_GRAY_200};
  margin-vertical: ${HEIGHT / 100}px;
`;

const InputContent = styled.TextInput`
  flex: 1;
  height: ${(HEIGHT / 100) * 5}px;
  margin: 0;
  font-size: ${normalize(14)}px;
`;

const ReportButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-vertical: ${HEIGHT / 100}px;
  margin-vertical: ${(HEIGHT * 3) / 100}px;
  background-color: ${(props: SubmitButton) =>
    props.isDisable ? BLUE_GRAY_200 : BLUE_A400};
  border-radius: ${WIDTH / 100}px;
  margin-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ButtonText = styled.Text`
  font-size: ${normalize(15)}px;
  color: ${WHITE};
  font-weight: bold;
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
  const listPost = useAppSelector(state => state.post.listPost);
  const [totalPost, setTotalPost] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigation = useNavigation<HomeScreenProps>();
  const dispatch = useAppDispatch();
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [postSelect, setPostSelect] = React.useState<PostInterface | null>(
    null,
  );
  const [showModal, setShowModal] = React.useState(false);
  const [showModalReport, setShowModalReport] = React.useState(false);
  const [typeReport, setTypeReport] = React.useState(-1);
  const [contentReport, setContentReport] = React.useState('');

  const onClickCreatePostButton = () => {
    navigation.navigate('CreatePostScreen');
  };

  const onClickUserOfPost = (uid: string) => {
    navigation.navigate('ProfileScreen', {
      uid: uid,
    });
  };

  const onClickEditPost = () => {
    if (postSelect) {
      setShowModal(false);
      navigation.navigate('EditPostScreen', {
        pid: postSelect._id,
        content: postSelect.content,
        urlImage: postSelect.uriImage || undefined,
      });
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onCloseModalReport = () => {
    setShowModalReport(false);
    setContentReport('');
    setTypeReport(-1);
  };

  const onClickReportButton = () => {
    setShowModalReport(true);
  };

  const onClickOptionButton = (post: PostInterface) => {
    setPostSelect(post);
    setShowModal(true);
  };

  const onClickTypeReportButton = (id: number) => {
    setTypeReport(id);
  };

  const onInputContentReport = (text: string) => {
    setContentReport(text);
  };

  const onSubmitReport = async () => {
    try {
      setIsLoading(true);
      if (postSelect) {
        const res = await dispatch(
          requestReportPost({
            postID: postSelect?._id,
            content:
              typeReport === REPORT_TYPE[REPORT_TYPE.length - 1].id
                ? contentReport
                : REPORT_TYPE[typeReport - 1].value,
          }),
        ).unwrap();
        if (res.status) {
          onCloseModalReport();
          onCloseModal();
        }
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const getListPost = async (page: number) => {
    setIsLoading(true);
    const response = await dispatch(requestGetPost({skip: 0})).unwrap();
    if (response.status) {
      if (page === 1) {
        setTotalPost(response.total || 0);
      }
    }
    setIsLoading(false);
  };

  const onLoadMore = () => {
    if (listPost.length < totalPost) {
      dispatch(requestGetPost({skip: listPost.length}));
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
        onClickOptionButton={onClickOptionButton}
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
    <Container>
      <FlatList
        data={listPost}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
        ListEmptyComponent={isLoading ? LoadingScreen : ListEmpty}
        ListHeaderComponent={
          <HeaderFlatList
            onPress={onClickCreatePostButton}
            avatarUser={avatarUser ? avatarUser : DEFAULT_AVATAR}
          />
        }
        refreshing={isRefresh}
        onRefresh={onRefresh}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        style={styles.modal}
        isVisible={showModal}
        onBackButtonPress={onCloseModal}
        onBackdropPress={onCloseModal}
        swipeDirection={'down'}>
        <ModalOptionContainer>
          <ModalIndicatorContainer>
            <ModalIndicator />
          </ModalIndicatorContainer>
          <ScrollView>
            {postSelect?.creater?._id === userID && (
              <OptionButton onPress={onClickEditPost}>
                <OptionContentText>Chỉnh sửa</OptionContentText>
                <FontAwesome5 name="edit" size={(WIDTH / 100) * 6} />
              </OptionButton>
            )}
            {postSelect?.creater?._id !== userID && (
              <OptionButton onPress={onClickReportButton}>
                <OptionContentText>Báo cáo</OptionContentText>
                <FontAwesome5 name="flag" size={(WIDTH / 100) * 6} />
              </OptionButton>
            )}
          </ScrollView>
          <Modal
            isVisible={showModalReport}
            style={styles.modalReport}
            onBackButtonPress={onCloseModalReport}
            onBackdropPress={onCloseModalReport}
            swipeDirection={'down'}>
            <ModalOptionReportContainer>
              <ModalReportHeader>
                <ModalReportHeaderText>Báo cáo bài viết</ModalReportHeaderText>
                <CancelButton onPress={onCloseModalReport}>
                  <FontAwesome5 size={(WIDTH / 100) * 6} name="times" />
                </CancelButton>
              </ModalReportHeader>
              <ScrollView>
                {REPORT_TYPE.map(report => {
                  return (
                    <OptionButton
                      activeOpacity={0.7}
                      key={`${report.id}`}
                      onPress={() => onClickTypeReportButton(report.id)}>
                      <OptionContentText>{report.value}</OptionContentText>
                      <ChooseContainer>
                        <Choose isChoose={report.id === typeReport} />
                      </ChooseContainer>
                    </OptionButton>
                  );
                })}
                <InputContentContainer>
                  <InputContent
                    value={contentReport}
                    placeholder={'Nội dung'}
                    onChangeText={(text: string) => onInputContentReport(text)}
                    editable={
                      typeReport === REPORT_TYPE[REPORT_TYPE.length - 1].id
                    }
                  />
                </InputContentContainer>
              </ScrollView>
              <ReportButton
                isDisable={
                  typeReport === -1 ||
                  (typeReport === REPORT_TYPE[REPORT_TYPE.length - 1].id &&
                    contentReport.trim() === '')
                }
                disable={
                  typeReport === -1 ||
                  (typeReport === REPORT_TYPE[REPORT_TYPE.length - 1].id &&
                    contentReport.trim() === '')
                }
                activeOpacity={0.7}
                onPress={onSubmitReport}>
                <ButtonText>Báo cáo</ButtonText>
              </ReportButton>
            </ModalOptionReportContainer>
          </Modal>
        </ModalOptionContainer>
      </Modal>
      {isLoading && <LoadingScreen />}
    </Container>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
    backgroundColor: BLUE_GRAY_200,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: TRANSPARENT,
    margin: 0,
  },
  modalReport: {
    flex: 1,
    backgroundColor: TRANSPARENT,
    margin: 0,
  },
});
