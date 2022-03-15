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
} from '../../feature/message/conversationSlice';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../constant/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {socketChat} from '../../socket/SocketClient';

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
  const currentPage = useAppSelector(state => state.conversation.currentPage);
  const userId = useAppSelector(state => state.auth.id);
  const dispatch = useAppDispatch();
  const {control, handleSubmit} = useForm<FormValues>();
  const navigation = useNavigation<MessageScreenProps>();

  const onSubmit: SubmitHandler<FormValues> = data => {};

  const onClickItem = (
    friendID: string,
    friendAvatar: string,
    friendName: string,
  ) => {
    navigation.navigate('ChatScreen', {
      friendID,
      friendAvatar,
      friendName,
    });
  };

  const getData = () => {
    dispatch(requestGetConversation({page: 1}));
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
    getData();
  }, []);

  React.useEffect(() => {
    socketChat.on('updateConversation', data => {
      if (data._id.indexOf(userId) !== -1) {
        dispatch(updateConversation({conversation: {...data}}));
      }
    });
    return () => {
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
      {listConversation.length === 0 ? (
        <ContainerTitleText>
          <TitleText>Hãy bắt đầu cuộc trò chuyện của bạn</TitleText>
        </ContainerTitleText>
      ) : (
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={listConversation}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </Container>
  );
}