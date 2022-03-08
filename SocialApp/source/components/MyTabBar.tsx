import React from 'react';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ARRAY_ICON_TAB} from '../constant/constants';
import {HEIGHT, WIDTH} from '../constant/dimensions';
import {BLUE_A400, BLUE_GRAY_200, WHITE} from '../constant/color';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const Container = styled.View``;

const ContainerTab = styled.View`
  flex-direction: row;
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-vertical: ${(HEIGHT / 100) * 1.5}px;
  background-color: ${WHITE};
`;

const Line = styled.View`
  height: 2px;
  width: 100%;
  background-color: ${BLUE_GRAY_200};
`;

export default function MyTabBar({state, descriptors, navigation, position}) {
  const indexActive = useSharedValue<number>(0);

  const stylesAnimated = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      width: WIDTH / 5,
      height: 2,
      backgroundColor: BLUE_A400,
      borderRadius: WIDTH / 100,
      transform: [
        {
          translateX: withTiming((indexActive.value * WIDTH) / 5),
        },
      ],
    };
  });

  return (
    <Container>
      <ContainerTab>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = (indexButton: number) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            indexActive.value = indexButton;
            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          return (
            <TabButton
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              key={index.toString()}
              onPress={() => onPress(index)}>
              <FontAwesome5
                name={ARRAY_ICON_TAB[index]}
                size={(WIDTH / 100) * 5.5}
                color={isFocused ? BLUE_A400 : BLUE_GRAY_200}
                solid={isFocused ? true : false}
              />
            </TabButton>
          );
        })}
      </ContainerTab>
      <Line />
      <Animated.View style={stylesAnimated} />
    </Container>
  );
}
