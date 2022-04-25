import * as React from 'react';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {
  BLACK,
  BLUE_GRAY,
  BLUE_GRAY_200,
  LIGHT_BLUE,
  WHITE,
} from '../../constant/color';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {FlatList} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Message, RootStackParamList} from '../../constant/types';
import MessageComponent from '../../components/MessageComponent';
import {
  requestGetMessage,
  requestSendMessage,
  resetListMessage,
  updateListMessage,
} from '../../feature/message/messageSlice';
import {BASE_URL, DEFAULT_AVATAR} from '../../constant/constants';
import {io, Socket} from 'socket.io-client';
import {socketChat} from '../../socket/SocketClient';
import Animated, {Layout, SequencedTransition} from 'react-native-reanimated';

interface ChatProps {
  route: {
    params: {
      conversationID?: string;
      userCreatorID?: string;
      participantID?: Array<string>;
      friendAvatar: string;
      friendName: string;
    };
  };
}

type ChatScreenProps = StackNavigationProp<RootStackParamList, 'ChatScreen'>;

type FormValues = {
  content: string;
};

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${(HEIGHT / 100) * 1.5}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  border-bottom-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const BackButton = styled.TouchableOpacity`
  padding-horizontal: ${(WIDTH / 100) * 3}px;
`;

const UserButton = styled.TouchableOpacity`
  flex-direction: row;
  flex: 1;
  align-items: center;
  margin-left: ${(WIDTH / 100) * 2}px;
`;

const UserHeaderImage = styled.Image`
  width: ${(WIDTH / 100) * 12}px;
  height: ${(WIDTH / 100) * 12}px;
  border-radius: ${(WIDTH / 100) * 8}px;
  resize-mode: cover;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
  margin-horizontal: ${(WIDTH / 100) * 2}px;
  flex: 1;
`;

const ToolButton = styled(BackButton)``;

const BottomContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${(HEIGHT / 100) * 1.75}px;
  border-top-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const InputContainer = styled.View`
  flex: 1;
  border-width: 1px;
  border-color: ${BLUE_GRAY_200}};
  border-radius: ${(WIDTH / 100) * 12}px;
  margin-horizontal: ${(WIDTH / 100) * 2}px;
`;

const InputText = styled.TextInput`
  width: 100%;
  padding-vertical: 0px;
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  height: ${(HEIGHT / 100) * 3.5}px;
  font-size: ${normalize(12)}px;
  font-weight: 400;
  color: ${BLACK};
`;

const ButtonImageChoose = styled.TouchableOpacity``;
const ImageChoose = styled.Image`
  width: ${(WIDTH / 100) * 20}px;
  height: ${(WIDTH / 100) * 20}px;
  border-radius: ${(WIDTH / 100) * 2}px;
  resize-mode: cover;
`;

export default function ChatScreen(props: ChatProps) {
  const navigation = useNavigation<ChatScreenProps>();
  const userID = useAppSelector(state => state.auth.id);
  const dispatch = useAppDispatch();
  const {control, handleSubmit, resetField} = useForm<FormValues>();
  const listMessage = useAppSelector(state => state.message.listMessage);
  const [uriImage, setUriImage] = React.useState(null);
  const [uriVideo, setUriVideo] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(1);
  const [friendName, setFriendName] = React.useState(null);
  const [friendAvatar, setFriendAvatar] = React.useState(null);
  const [conversationID, setConversationID] = React.useState(null);
  const [listParticipants, setListParticipants] = React.useState([]);

  const refSocket = React.useRef<Socket>();

  const onBack = () => {
    navigation.goBack();
  };

  const onShowProfile = () => {};

  const onOpenCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.9,
        cameraType: 'back',
      },
      response => {
        if (response.assets) {
          setUriImage(response.assets[0].uri);
        }
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
          setUriImage(response.assets[0].uri);
        }
      },
    );
  };

  const onDeleteImage = () => {
    setUriImage(null);
  };

  const onSendMessage: SubmitHandler<FormValues> = async data => {
    if (data.content === '' && !uriImage && !uriVideo) {
      return;
    }
    resetField('content');
    const message = {
      content: data.content,
      urlImage: null,
      userSend: userID,
      conversation: conversationID,
      participants:
        listParticipants.length === 0
          ? [...props.route.params.participantID]
          : listParticipants,
    };
    const res = await dispatch(requestSendMessage({message})).unwrap();
    if (res.status) {
      dispatch(updateListMessage({message: res.messageResponse}));
      refSocket.current.emit(
        'sendMessage',
        conversationID,
        res.messageResponse,
      );
      refSocket.current.emit('updateConversation', res.conversationID);
    }
  };

  const renderItem = ({item, index}) => {
    const isLastMessage =
      item.userSend?._id === listMessage[index - 1]?.userSend?._id &&
      item.userSend?._id !== listMessage[index + 1]?.userSend?._id;
    return (
      <MessageComponent
        item={item}
        userID={userID}
        isLastMessage={isLastMessage}
        friend={{friendAvatar}}
      />
    );
  };

  const getData = async (page: number) => {
    if (props.route.params.conversationID) {
      const res = await dispatch(
        requestGetMessage({
          page: page,
          conversationID: props.route.params.conversationID,
          participants: null,
        }),
      ).unwrap();
      if (res.status) {
        if (page === 1) {
          setTotal(res.total);
          setConversationID(res.conversationID);
          const newListParticipants = res.listMessage[0].participants.filter(
            item => item._id !== userID,
          );
          setFriendAvatar(newListParticipants[0].avatar);
          setListParticipants(res.listMessage[0].participants);
          setFriendName(newListParticipants[0].name);
        }
        setCurrentPage(res.currentPage);
      }
    } else {
      const res = await dispatch(
        requestGetMessage({
          page: page,
          participants: props.route.params.participantID,
          conversationID: null,
        }),
      ).unwrap();
      if (res.status) {
        if (page === 1) {
          setTotal(res.total);
          setConversationID(res.conversationID);
          if (res.listMessage[0]) {
            setListParticipants(res.listMessage[0].participants);
          }
        }
        setCurrentPage(res.currentPage);
      }
    }
  };

  const onLoadMore = () => {
    if (listMessage.length < total) {
      getData(currentPage + 1);
    }
  };

  React.useEffect(() => {
    getData(1);
  }, []);

  React.useEffect(() => {
    socketChat.emit('join room', conversationID);
    socketChat.on('receiverMessage', message => {
      dispatch(updateListMessage({message}));
    });
    refSocket.current = socketChat;
    return () => {
      socketChat.emit(
        'leave room',
        conversationID || props.route.params.conversationID,
      );
      socketChat.off('receiverMessage');
      dispatch(resetListMessage());
    };
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <BackButton onPress={onBack}>
          <FontAwesome5
            name={'arrow-left'}
            size={(WIDTH / 100) * 5}
            color={LIGHT_BLUE}
          />
        </BackButton>
        <UserButton>
          <UserHeaderImage
            source={{
              uri:
                friendAvatar ||
                props.route.params.friendAvatar ||
                DEFAULT_AVATAR,
            }}
          />
          <UserNameText>
            {friendName || props.route.params.friendName}
          </UserNameText>
        </UserButton>
        <ToolButton>
          <FontAwesome5
            name={'phone-alt'}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 5}
          />
        </ToolButton>
        <ToolButton>
          <FontAwesome5
            name={'video'}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 5}
          />
        </ToolButton>
        <ToolButton onPress={onShowProfile}>
          <FontAwesome5
            name={'info-circle'}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 5}
          />
        </ToolButton>
      </HeaderContainer>
      <FlatListAnimated
        data={listMessage}
        renderItem={renderItem}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={(item: any) => item._id}
        inverted={true}
        layout={Layout.springify()}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
      <BottomContainer>
        <ToolButton onPress={onOpenCamera}>
          <FontAwesome5
            name={'camera'}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 4.5}
          />
        </ToolButton>
        <ToolButton onPress={onOpenLibrary}>
          <FontAwesome5
            name={'image'}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 4.5}
          />
        </ToolButton>
        <ToolButton>
          <FontAwesome5
            name={'microphone'}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 4.5}
          />
        </ToolButton>
        <Controller
          name="content"
          control={control}
          render={({field: {value, onChange}}) => {
            return (
              <InputContainer>
                <InputText
                  value={value}
                  onChangeText={onChange}
                  placeholder={'Aa'}
                />
              </InputContainer>
            );
          }}
        />
        <ToolButton onPress={handleSubmit(onSendMessage)}>
          <FontAwesome5
            name={'paper-plane'}
            solid={true}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 4.5}
          />
        </ToolButton>
      </BottomContainer>
      {uriImage !== null && (
        <BottomContainer>
          <ButtonImageChoose onPress={onDeleteImage}>
            <ImageChoose source={{uri: uriImage}} />
          </ButtonImageChoose>
        </BottomContainer>
      )}
    </Container>
  );
}
