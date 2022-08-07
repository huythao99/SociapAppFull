import * as React from 'react';
import styled from 'styled-components';
import {BLACK, BLUE_GRAY_200} from '../constant/color';
import {DEFAULT_AVATAR} from '../constant/constants';
import {HEIGHT, WIDTH, normalize} from '../constant/dimensions';
import {CommentItem} from '../constant/types';
import {timeAgo} from '../ultilities/Ultilities';
import Animated, {Layout, LightSpeedInLeft} from 'react-native-reanimated';

interface CommentItemProps {
  item: CommentItem;
}

const AvatarImage = styled.Image`
  width: ${(WIDTH / 100) * 11}px;
  height: ${(WIDTH / 100) * 11}px;
  border-radius: ${(WIDTH / 100) * 6}px;
`;

const ContentContainer = styled.View`
  border-radius: ${(WIDTH / 100) * 2}px;
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  margin-horizontal: ${WIDTH / 100}px;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
`;

const ContentText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
`;

const ImageContent = styled.Image`
  width: ${(WIDTH / 100) * 12}px;
  height: ${(WIDTH / 100) * 12}px;
  border-radius: ${(WIDTH / 100) * 2}px;
`;

const TimeText = styled.Text`
  font-size: ${normalize(11)}px;
  font-weight: 400,
  color: ${BLUE_GRAY_200}
  margin-top: ${HEIGHT / 100 / 2}px;
`;

export default function CommentComponent(props: CommentItemProps) {
  return (
    <Animated.View
      entering={LightSpeedInLeft.duration(500)}
      layout={Layout.springify()}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: (HEIGHT / 100) * 2,
        paddingHorizontal: (WIDTH / 100) * 4,
      }}>
      <AvatarImage source={{uri: props.item.user.avatar || DEFAULT_AVATAR}} />
      <ContentContainer>
        <UserNameText>{props.item.user.name}</UserNameText>
        <ContentText>{props.item.content}</ContentText>
        {props.item.urlImage && (
          <ImageContent source={{uri: props.item.urlImage}} />
        )}
        <TimeText>{timeAgo(props.item.timeCreate)}</TimeText>
      </ContentContainer>
    </Animated.View>
  );
}
