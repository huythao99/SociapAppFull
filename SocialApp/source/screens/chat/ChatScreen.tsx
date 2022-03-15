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
import {RootStackParamList} from '../../constant/types';
import MessageComponent from '../../components/MessageComponent';
import {
  requestGetMessage,
  updateListMessage,
} from '../../feature/message/messageSlice';
import {BASE_URL, DEFAULT_AVATAR} from '../../constant/constants';
import {sortID} from '../../ultilities/Ultilities';
import {io, Socket} from 'socket.io-client';
import {socketChat} from '../../socket/SocketClient';

interface ChatProps {
  route: {
    params: {
      friendID: string;
      friendAvatar: string;
      friendName: string;
      friendEmail?: string;
    };
  };
}

type ChatScreenProps = StackNavigationProp<RootStackParamList, 'ChatScreen'>;

type FormValues = {
  content: string;
};

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
  const userAvatar = useAppSelector(state => state.auth.avatar);
  const userName = useAppSelector(state => state.auth.name);
  const userEmail = useAppSelector(state => state.auth.email);
  const dispatch = useAppDispatch();
  const {control, handleSubmit, resetField} = useForm<FormValues>();
  const listMessage = useAppSelector(state => state.message.listMessage);
  const [uriImage, setUriImage] = React.useState(null);
  const [uriVideo, setUriVideo] = React.useState(null);
  const currentPage = useAppSelector(state => state.message.currentPage);

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
    refSocket.current.emit(
      'sendMessage',
      sortID(userID, props.route.params.friendID),
      {
        content: data.content,
        timeCreate: Date.now,
        urlImage: null,
        senderID: userID,
        receiverID: {
          _id: props.route.params.friendID,
          name: props.route.params.friendName,
          avatar: props.route.params.friendAvatar,
        },
      },
    );
    dispatch(
      updateListMessage({
        content: data.content,
        timeCreate: Date.now(),
        urlImage: null,
        senderID: userID,
        receiverID: {
          _id: props.route.params.friendID,
          name: props.route.params.friendName,
          avatar: props.route.params.friendAvatar,
        },
      }),
    );
  };

  const renderItem = ({item, index}) => {
    const isLastMessage =
      item.senderID === listMessage[index - 1]?.senderID &&
      item.senderID !== listMessage[index + 1]?.senderID;
    return (
      <MessageComponent
        item={item}
        userID={userID}
        isLastMessage={isLastMessage}
        friend={{friendAvatar: props.route.params.friendAvatar}}
      />
    );
  };

  const getData = () => {
    dispatch(
      requestGetMessage({page: 1, receiverID: props.route.params.friendID}),
    );
  };

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    socketChat.emit('join room', sortID(userID, props.route.params.friendID));
    socketChat.on('receiverMessage', message => {
      dispatch(updateListMessage({...message}));
    });
    refSocket.current = socketChat;
    return () => {
      socketChat.emit(
        'leave room',
        sortID(userID, props.route.params.friendID),
      );
      socketChat.off('receiverMessage');
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
            source={{uri: props.route.params.friendAvatar || DEFAULT_AVATAR}}
          />
          <UserNameText>{props.route.params.friendName}</UserNameText>
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
      <FlatList
        data={listMessage}
        renderItem={renderItem}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={(_, index) => index.toString()}
        inverted={true}
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
