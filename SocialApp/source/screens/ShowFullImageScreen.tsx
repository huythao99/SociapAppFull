import * as React from 'react';
import {StatusBar, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {BLACK, TRANSPARENT, WHITE} from '../constant/color';
import {HEIGHT, WIDTH} from '../constant/dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

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

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  left: 0px;
  right: 0px;
  justify-content: space-between;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${HEIGHT / 100 / 2}px;
  position: absolute;
  background-color: ${TRANSPARENT};
  top: 0px;
`;

export default function ShowFullImageScreen(props: ShowImageProps) {
  const navigation = useNavigation();

  const onGoback = () => {
    navigation.goBack();
  };

  return (
    <Container>
      <StatusBar
        animated={true}
        backgroundColor={BLACK}
        barStyle={'light-content'}
      />
      <ContentImage
        source={{uri: props.route.params.uriImage}}
        width={props.route.params.width}
        height={props.route.params.height}
      />
      <HeaderContainer>
        <TouchableOpacity onPress={onGoback}>
          <FontAwesome5
            name="arrow-left"
            size={(WIDTH / 100) * 5.5}
            color={WHITE}
          />
        </TouchableOpacity>
      </HeaderContainer>
    </Container>
  );
}
