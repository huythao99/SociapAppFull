import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {showAlert} from '../ultilities/Ultilities';
import {BASE_URL} from '../constant/constants';

export default async function callAPI(
  method: 'post' | 'get' | 'put' | 'patch' | 'delete',
  url: string,
  data: any,
  params: any,
  contentType?: string,
) {
  const value = await AsyncStorage.getItem('user');
  const jsonValue = value != null ? JSON.parse(value) : null;
  const headers = {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': contentType ? contentType : 'application/json',
    'auth-token': jsonValue ? jsonValue.token : null,
  };
  const res = await axios({
    method,
    data,
    url: url,
    headers,
    params,
    baseURL: BASE_URL,
    timeout: 5000,
  });
  if (res.status === 200 && res.data.status === 1) {
    return res.data;
  } else {
    console.log(res);
  }
}
