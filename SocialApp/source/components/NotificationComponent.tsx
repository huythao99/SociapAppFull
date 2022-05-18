import * as React from 'react';
import {NotificationItem, RootStackParamList} from '../constant/types';
import styled from 'styled-components/native';
import {HEIGHT, normalize, WIDTH} from '../constant/dimensions';
import {DEFAULT_AVATAR} from '../constant/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {BLACK, BLUE_50, WHITE} from '../constant/color';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppDispatch} from '../app/hook';
import {
  requestUpdateStatusNotification,
  updateStatusNotification,
} from '../feature/notification/notificationSlice';

interface NotificationProps {
  item: NotificationItem;
}

type ContainerProps = {
  isSeen: boolean;
};

type NotificationScreenProps = StackNavigationProp<
  RootStackParamList,
  'NotificationScreen'
>;

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${HEIGHT / 100}px;
  background-color: ${(props: ContainerProps) =>
    props.isSeen ? WHITE : BLUE_50};
`;

const Avatar = styled.Image`
  width: ${(WIDTH / 100) * 15}px;
  height: ${(WIDTH / 100) * 15}px;
  border-radius: ${(WIDTH / 100) * 8}px;
  resize-mode: cover;
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-horizontal: ${(WIDTH / 100) * 3}px;
`;

const ContentTitle = styled.Text`
  font-weight: 700;
  font-size: ${normalize(13)}px;
  text-align: left;
  margin-bottom: ${HEIGHT / 100 / 2}px;
  flex: 1;
  color: ${BLACK};
`;

const ContentText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(13)}px;
  text-align: left;
  flex: 1;
  color: ${BLACK};
`;

const IconContainer = styled.TouchableOpacity`
  padding-horizontal: ${WIDTH / 100}px;
`;

function NotificationComponent(props: NotificationProps) {
  const navigation = useNavigation<NotificationScreenProps>();
  const dispatch = useAppDispatch();
  const onPressItem = () => {
    switch (props.item.type) {
      case 'COMMENT':
        navigation.navigate('CommentPostScreen', {
          postID: props.item.post,
        });
        if (!props.item.isSeen) {
          dispatch(requestUpdateStatusNotification({id: props.item._id}));
          dispatch(updateStatusNotification({_id: props.item._id}));
        }
        break;
      case 'FOLLOW':
        navigation.navigate('ProfileScreen', {
          uid: props.item.user._id,
        });
        if (!props.item.isSeen) {
          dispatch(requestUpdateStatusNotification({id: props.item._id}));
          dispatch(updateStatusNotification({_id: props.item._id}));
        }
        break;
      default:
        break;
    }
  };

  return (
    <Container isSeen={props.item.isSeen} onPress={onPressItem}>
      <Avatar
        source={{
          uri: props.item.user.avatar ? props.item.user.avatar : DEFAULT_AVATAR,
        }}
      />
      <ContentContainer>
        <ContentTitle numberOfLines={3} ellipsizeMode={'tail'}>
          {props.item.title}
        </ContentTitle>
        <ContentText numberOfLines={3} ellipsizeMode={'tail'}>
          {props.item.body}
        </ContentText>
      </ContentContainer>
      <IconContainer>
        <FontAwesome5
          name={'ellipsis-h'}
          size={(WIDTH / 100) * 4.5}
          color={BLACK}
        />
      </IconContainer>
    </Container>
  );
}

function areEquals(prevProps: NotificationProps, nextProps: NotificationProps) {
  if (
    prevProps.item.isSeen === nextProps.item.isSeen &&
    prevProps.item._id === nextProps.item._id
  ) {
    return true;
  }
  return false;
}

export default React.memo(NotificationComponent, areEquals);
