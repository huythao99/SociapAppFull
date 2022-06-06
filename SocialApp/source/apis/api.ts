import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../constant/constants';

export default async function callAPI(
  method: 'post' | 'get' | 'put' | 'patch' | 'delete',
  url: string,
  data: any,
  params: any,
  contentType?: string,
) {
  try {
    const value = await AsyncStorage.getItem('user');
    const jsonValue = value != null ? JSON.parse(value) : null;
    const headers = {
      Accept: 'application/json, text/plain, */*',
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
      timeout: 10000,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error);
  }
}
