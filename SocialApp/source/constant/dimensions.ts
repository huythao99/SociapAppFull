import {Dimensions, Platform, PixelRatio} from 'react-native';
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

const scale = WIDTH / 320;
export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
