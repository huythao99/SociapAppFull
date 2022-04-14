import * as React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components';
import {BLACK} from '../constant/color';
import {DEFAULT_AVATAR} from '../constant/constants';
import {HEIGHT, WIDTH, normalize} from '../constant/dimensions';

const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

const AvatarImage = styled.Image`
  width: ${(WIDTH / 100) * 8}px;
  height: ${(WIDTH / 100) * 8}px;
  border-radius: ${(WIDTH / 100) * 4}px;
`;

const ContentContainer = styled.View`
  border-radius: ${(WIDTH / 100) * 2}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${HEIGHT / 100}px;
  margin-horizontal: ${(WIDTH / 100) * 2}px;
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
  margin-top: ${HEIGHT / 100}px;
`;

export default function CommentItem(props) {
  return (
    <Container>
      <AvatarImage source={{uri: DEFAULT_AVATAR}} />
      <ContentContainer>
        <UserNameText>User three</UserNameText>
        <ContentText>123</ContentText>
      </ContentContainer>
    </Container>
  );
}
