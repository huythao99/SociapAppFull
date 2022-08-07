import React from 'react';
import styled from 'styled-components/native';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {BLACK, BLUE_GRAY, BLUE_GRAY_200, WHITE} from '../../constant/color';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {FlatList} from 'react-native';
import {ConversationItem} from '../../constant/types';
import ConversationComponent from '../../components/ConversationComponent';
import {
  requestGetConversation,
  updateConversation,
  updateStatusConversation,
} from '../../feature/message/conversationSlice';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../constant/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {socketChat} from '../../socket/SocketClient';
import ListEmpty from '../../components/ListEmpty';

type FormValues = {
  search: String;
};

type MessageScreenProps = StackNavigationProp<
  RootStackParamList,
  'MessageScreen'
>;

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const SearchContainer = styled.View`
  flex-direction: row;
  margin-horizontal: ${(WIDTH / 100) * 4}px;
  border-radius: ${(WIDTH / 100) * 5}px;
  background-color: ${BLUE_GRAY};
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  align-items: center;
  margin-vertical: ${(HEIGHT / 100) * 2}px;
`;

const InputText = styled.TextInput`
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  padding-vertical: 0px;
  height: ${(HEIGHT / 100) * 5}px;
  font-weight: 400;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
  flex: 1;
`;

const SearchButton = styled.TouchableOpacity`
  padding: ${WIDTH / 100}px;
`;

const ContainerTitleText = styled(Container)`
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.Text`
  font-size: ${normalize(16)}px;
  font-weight: 700;
  color: ${BLUE_GRAY_200};
`;

export default function MessageScreen() {
  const listConversation = useAppSelector(
    state => state.conversation.listConversation,
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(1);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const userId = useAppSelector(state => state.auth.id);
  const dispatch = useAppDispatch();
  const {control, handleSubmit} = useForm<FormValues>();
  const navigation = useNavigation<MessageScreenProps>();

  const onSubmit: SubmitHandler<FormValues> = data => {};

  const onClickItem = (conversationID: string) => {
    navigation.navigate('ChatScreen', {
      conversationID,
    });
  };

  const getData = async (page: number) => {
    const res = await dispatch(requestGetConversation({page})).unwrap();
    if (res.status) {
      if (page === 1) {
        setTotal(res.total);
      }
      setCurrentPage(res.currentPage);
    }
    setIsRefresh(false);
  };

  const onRefresh = () => {
    setIsRefresh(true);
    getData(1);
  };

  const onLoadMore = () => {
    if (listConversation.length < total) {
      getData(currentPage + 1);
    }
  };

  const renderItem = ({item}: {item: ConversationItem}) => {
    return (
      <ConversationComponent
        uid={userId}
        item={item}
        onClickItem={onClickItem}
      />
    );
  };

  React.useEffect(() => {
    getData(1);
  }, []);

  React.useEffect(() => {
    socketChat.on('updateConversation', data => {
      if (
        data.participants.findIndex(
          (item: {_id: string}) => item._id === userId,
        ) !== -1
      ) {
        dispatch(updateConversation({conversation: {...data}, user: userId}));
      }
    });
    socketChat.on('updateStatusConversation', conversationID => {
      dispatch(updateStatusConversation({conversationID, userID: userId}));
    });
    return () => {
      socketChat.off('updateStatusConversation');
      socketChat.off('updateConversation');
    };
  }, []);

  return (
    <Container>
      <Controller
        control={control}
        name={'search'}
        render={({field: {onChange, value}}) => {
          return (
            <SearchContainer>
              <InputText
                value={value}
                placeholder={'Tìm kiếm'}
                onChangeText={onChange}
              />
              <SearchButton>
                <FontAwesome5
                  name={'search'}
                  size={(WIDTH / 100) * 5}
                  color={BLUE_GRAY_200}
                />
              </SearchButton>
            </SearchContainer>
          );
        }}
      />
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        data={listConversation}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefresh}
        onRefresh={onRefresh}
        ListEmptyComponent={ListEmpty}
      />
    </Container>
  );
}
