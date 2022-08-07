import * as React from 'react';
import styled from 'styled-components/native';
import {BLUE_GRAY} from '../constant/color';

const Container = styled.View`
  height: 2px;
  width: 100%;
  background-color: ${BLUE_GRAY};
`;

export default function LineItem() {
  return <Container />;
}
