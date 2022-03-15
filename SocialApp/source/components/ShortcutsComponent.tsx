import * as React from 'react';
import styled from 'styled-components/native';
import {BLACK, BLUE_GREY_50, WHITE} from '../constant/color';
import {HEIGHT, normalize, WIDTH} from '../constant/dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface ShortcutsProps {
  icon: string;
  name: string;
  color: string;
}

const ContainerButton = styled.TouchableOpacity`
  padding-vertical: ${(HEIGHT / 100) * 1.5}px;
  margin-vertical: ${HEIGHT / 100 / 2}px;
  border-radius: ${(WIDTH / 100) * 1.5}px;
  elevation: 10;
  width: 47%;
  margin-left: ${(WIDTH / 100) * 2}px;
  background-color: ${WHITE};
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  shadow-color: ${BLUE_GREY_50};
  shadow-radius: ${WIDTH / 100}px;
  shadow-opacity: 0.2;
`;

const NameButtonText = styled.Text`
  font-weight: bold;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
  margin-top: ${HEIGHT / 100}px;
`;

const ShortcutsComponent = (props: ShortcutsProps) => {
  return (
    <ContainerButton>
      <FontAwesome5
        name={props.icon}
        color={props.color}
        size={(WIDTH / 100) * 5}
      />
      <NameButtonText>{props.name}</NameButtonText>
    </ContainerButton>
  );
};

export default React.memo(ShortcutsComponent);
