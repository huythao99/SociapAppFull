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

export const timeAgo = (time: number) => {
  const now = Date.now();
  const ago = Math.round((now - time) / 1000);
  if (ago < 60) {
    return 'Vừa xong';
  } else if (ago < 3600) {
    return `${Math.round(ago / 60)} phút`;
  } else if (ago < 86400) {
    return `${Math.round(ago / 3600)} giờ`;
  } else if (ago < 86400 * 30) {
    return `${Math.round(ago / 86400)} ngày`;
  } else if (ago < 86400 * 30 * 12) {
    return `${Math.round(ago / (86400 * 30 * 12))} tháng`;
  } else return `${Math.round(ago / (86400 * 30))} năm`;
};
