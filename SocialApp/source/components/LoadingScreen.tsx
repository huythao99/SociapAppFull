import React, {useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {BLUE_GRAY, TRANSPARENT, WHITE} from '../constant/color';
import {HEIGHT, WIDTH} from '../constant/dimensions';

const DATA = Array(12).fill(0);

const SPACE = 30;

export default function LoadingScreen() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const onStart = () => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 11,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  };

  useEffect(() => {
    onStart();
  }, []);

  return (
    <View style={styles.container}>
      {DATA.map((_, index: number) => {
        return (
          <Animated.View
            style={[
              styles.indicator,
              {
                opacity: animatedValue.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [0.25, 1, 0.25],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateY: -130,
                  },
                  {
                    translateY:
                      index <= 6 ? index * SPACE : (12 - index) * SPACE,
                  },
                  {
                    translateX:
                      index <= 3
                        ? index * SPACE
                        : index <= 9
                        ? (6 - index) * SPACE
                        : (index - 12) * SPACE,
                  },
                  {
                    rotateZ: `${(index * 180) / 6 - 90}deg`,
                  },
                ],
              },
            ]}
            key={index.toString()}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    backgroundColor: TRANSPARENT,
    top: 0,
    zIndex: 100,
  },
  indicator: {
    width: (WIDTH / 100) * 6,
    height: 5,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BLUE_GRAY,
    borderRadius: 2,
    position: 'absolute',
  },
});
