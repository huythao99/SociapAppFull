import * as React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {ConversationItem} from '../constant/types';
import {BLACK, BLUE_GRAY, GREY_700} from '../constant/color';
import {HEIGHT, normalize, WIDTH} from '../constant/dimensions';
import {timeAgo} from '../ultilities/Ultilities';
import {DEFAULT_AVATAR} from '../constant/constants';

interface ConversationComponentProps {
  item: ConversationItem;
  uid: String;
  onClickItem: (conversationID: string) => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  padding-vertical: ${(HEIGHT / 100) * 2}px;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  border-top-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const LeftContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const AvatarImage = styled.Image`
  width: ${(WIDTH / 100) * 15}px;
  height: ${(WIDTH / 100) * 15}px;
  border-radius: ${(WIDTH / 100) * 8}px;
  resize-mode: cover;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
  margin-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ContentMessageText = styled.Text`
  font-size: ${normalize(12)}px;
  color: ${GREY_700};
  margin-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ContentTimeText = styled(ContentMessageText)`
  margin-horizontal: 0px;
`;

function ConversationComponent(props: ConversationComponentProps) {
  return (
    <Container onPress={() => props.onClickItem(props.item._id)}>
      <LeftContainer>
        <AvatarImage
          source={{
            uri:
              props.uid === props.item.participants[0]._id
                ? props.item.participants[1].avatar || DEFAULT_AVATAR
                : props.item.participants[0].avatar || DEFAULT_AVATAR,
          }}
        />
        <View>
          <UserNameText>
            {props.uid === props.item.participants[0].avatar
              ? props.item.participants[0].name
              : props.item.participants[1].name}
          </UserNameText>
          <ContentMessageText>{props.item.lastMessage}</ContentMessageText>
        </View>
      </LeftContainer>
      <ContentTimeText>
        {timeAgo(Number(new Date(props.item.timeSend.toString())))}
      </ContentTimeText>
    </Container>
  );
}

function areEquals(
  prevProps: ConversationComponentProps,
  nextProps: ConversationComponentProps,
) {
  if (prevProps.item.lastMessage === nextProps.item.lastMessage) {
    return true;
  }
  return false;
}

export default React.memo(ConversationComponent, areEquals);
