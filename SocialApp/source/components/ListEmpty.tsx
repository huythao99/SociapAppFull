import * as React from 'react';
import styled from 'styled-components/native';
import {GREY_600, WHITE} from '../constant/color';
import {normalize} from '../constant/dimensions';

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: ${normalize(18)}px;
  color: ${GREY_600};
`;

export default function ListEmpty() {
  return (
    <Container>
      <TitleText>Hiện không tìm thấy dữ liệu nào</TitleText>
    </Container>
  );
}
