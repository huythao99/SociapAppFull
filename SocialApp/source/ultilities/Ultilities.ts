import {showMessage} from 'react-native-flash-message';

export const showAlert = (
  description: string,
  type: 'success' | 'warning' | 'danger' | 'info',
) => {
  showMessage({
    message: 'Thông báo',
    description,
    type: type,
    duration: 2000,
  });
};
