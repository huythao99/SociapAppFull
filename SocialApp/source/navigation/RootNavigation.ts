import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from '../constant/types';
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: any, params: any) {
  console.log('run');
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
