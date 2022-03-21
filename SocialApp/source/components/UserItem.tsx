import * as React from 'react';
import styled from 'styled-components/native';
import {BLUE_A400, BLUE_GRAY, WHITE} from '../constant/color';
import {WIDTH, HEIGHT, normalize} from '../constant/dimensions';
import {DEFAULT_AVATAR} from '../constant/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useAppSelector} from '../app/hook';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../constant/types';

interface UserItemProps {
  item: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const Container = styled.TouchableOpacity`
  background-color: ${WHITE};
  padding-horizontal: ${(WIDTH * 5) / 100}px;
  padding-vertical: ${HEIGHT / 100}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserImage = styled.Image`
  width: ${(WIDTH / 100) * 12}px;
  height: ${(WIDTH / 100) * 12}px;
  border-radius: ${(WIDTH / 100) * 6}px;
  resize-mode: cover;
`;

const UserNameText = styled.Text`
  font-weight: bold;
  font-size: ${normalize(15)}px;
  margin-left: ${(WIDTH / 100) * 4}px;
`;

const MessageButton = styled.TouchableOpacity`
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

function UserItem({item}: UserItemProps) {
  const currentUserID = useAppSelector(state => state.auth.id);
  const navigation = useNavigation<HomeScreenProps>();
  const onStartChat = () => {
    navigation.navigate('ChatScreen', {
      friendID: item.id,
      friendName: item.name,
      friendAvatar: item.avatar,
    });
  };
  return (
    <Container>
      <UserContainer>
        <UserImage source={{uri: item.avatar || DEFAULT_AVATAR}} />
        <UserNameText>{item.name}</UserNameText>
      </UserContainer>
      {currentUserID !== item.id && (
        <MessageButton onPress={() => onStartChat()}>
          <FontAwesome5
            name="facebook-messenger"
            size={(WIDTH / 100) * 5.5}
            color={BLUE_A400}
          />
        </MessageButton>
      )}
    </Container>
  );
}

function areEquals(prevProps: UserItemProps, nextProps: UserItemProps) {
  if (prevProps.item.avatar === nextProps.item.avatar) {
    return true;
  }
  return false;
}

export default React.memo(UserItem, areEquals);
