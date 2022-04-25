import * as React from 'react';
import {MessageItem} from '../constant/types';
import styled from 'styled-components/native';
import {HEIGHT, normalize, WIDTH} from '../constant/dimensions';
import {BLACK, BLUE_GRAY, LIGHT_BLUE, WHITE} from '../constant/color';
import {DEFAULT_AVATAR} from '../constant/constants';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  SlideInDown,
  SlideInRight,
  SlideInUp,
} from 'react-native-reanimated';

interface MessageItemProps {
  item: MessageItem;
  userID: string;
  isLastMessage: Boolean;
  friend: {
    friendAvatar: string;
  };
}

type ContainerProps = {
  isMessageOfFriend: Boolean;
};

const Container = styled.View`
  flex-direction: row;
  justify-content: ${(props: ContainerProps) =>
    props.isMessageOfFriend ? 'flex-start' : 'flex-end'};
  margin-horizontal: ${(WIDTH / 100) * 4}px;
  margin-vertical: ${HEIGHT / 100}px;
`;

const UserImage = styled.Image`
  width: ${(WIDTH / 100) * 10}px;
  height: ${(WIDTH / 100) * 10}px;
  resize-mode: cover;
  border-radius: ${(WIDTH / 100) * 6}px;
`;

const MessageFriendContainer = styled.View`
  max-width: ${(WIDTH / 100) * 70}px;
  background-color: ${BLUE_GRAY};
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  margin-horizontal: ${WIDTH / 100}px;
  border-radius: ${(WIDTH / 100) * 3}px;
  padding-vertical: ${HEIGHT / 100 / 2}px;
`;

const MessageFriendText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
`;

const MessageImage = styled.Image`
  width: ${(WIDTH / 100) * 60}px;
  height: ${(WIDTH / 100) * 70}px;
  resize-mode: cover;
  margin-top: ${HEIGHT / 100}px;
  border-radius: ${(WIDTH / 100) * 2}px;
`;

const MessageUserContainer = styled(MessageFriendContainer)`
  background-color: ${LIGHT_BLUE};
`;

const MessageUserText = styled(MessageFriendText)`
  color: ${WHITE};
`;

function MessageComponent(props: MessageItemProps) {
  return (
    <Animated.View
      entering={FadeInDown}
      layout={Layout.springify()}
      style={{
        flexDirection: 'row',
        justifyContent:
          props.item.userSend._id !== props.userID ? 'flex-start' : 'flex-end',
        marginHorizontal: (WIDTH / 100) * 4,
        marginVertical: HEIGHT / 100,
      }}>
      {props.item.userSend._id !== props.userID ? (
        <>
          <UserImage
            source={{uri: props.friend.friendAvatar || DEFAULT_AVATAR}}
          />
          <MessageFriendContainer>
            <MessageFriendText>{props.item.content}</MessageFriendText>
            {!!props.item.urlImage && (
              <MessageImage source={{uri: props.item.urlImage}} />
            )}
          </MessageFriendContainer>
        </>
      ) : (
        <>
          <MessageUserContainer>
            <MessageUserText>{props.item.content}</MessageUserText>
            {!!props.item.urlImage && (
              <MessageImage source={{uri: props.item.urlImage}} />
            )}
          </MessageUserContainer>
        </>
      )}
    </Animated.View>
  );
}

export default React.memo(MessageComponent);
