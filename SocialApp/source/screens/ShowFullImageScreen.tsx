import * as React from 'react';
import styled from 'styled-components/native';
import {BLACK} from '../constant/color';
import {HEIGHT, WIDTH} from '../constant/dimensions';

interface ShowImageProps {
  route: {
    params: {
      uriImage: string;
      width: number;
      height: number;
    };
  };
}

type ImageProps = {
  width: number;
  height: number;
};

const Container = styled.View`
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  background-color: ${BLACK};
  justify-content: center;
`;

const ContentImage = styled.Image`
  width: ${WIDTH}px;
  height: ${(props: ImageProps) => (props.height * WIDTH) / props.width}px;
`;

export default function ShowFullImageScreen(props: ShowImageProps) {
  return (
    <Container>
      <ContentImage
        source={{uri: props.route.params.uriImage}}
        width={props.route.params.width}
        height={props.route.params.height}
      />
    </Container>
  );
}
