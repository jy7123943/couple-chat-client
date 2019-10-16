import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';
import getEnvVars from '../environment';
const { apiUrl } = getEnvVars();
import axios from 'axios';

export const signUpApi = (user) => {
  return axios({
    method: 'post',
    url: `${apiUrl}/signUp`,
    data: {
      ...user
    }
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err);
      return err.response.data;
    });
};

export const loginApi = (id, password) => {
  return axios({
    method: 'post',
    url: `${apiUrl}/login`,
    data: {
      id, password
    }
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err);
      return err.response.data;
    });
};

export const profileImgUploadApi = (imgFormData, token) => {
  return axios({
    method: 'put',
    url: `${apiUrl}/profileUpload`,
    data: imgFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};

export const sendUserPushToken = async (token) => {
  console.log('--- sendUserPushToken ---');
  try {
    let { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      status = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (status !== 'granted') {
        throw new Error('permission not granted');
      }
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();
    console.log('push token: ', pushToken, token);
    return axios({
      method: 'put',
      url: `${apiUrl}/users/pushToken`,
      data: JSON.stringify({ pushToken }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch (err) {
    if (err.message === 'permission not granted') {
      return Alert.alert(
        '알림',
        '채팅 알림을 위해서 푸시 알림 접근 권한이 필요합니다.',
        [{ text: '확인' }]
      );
    }
    console.log(err);
  }
};

export const getUserInfoApi = async (token) => {
  return axios({
    method: 'get',
    url: `${apiUrl}/users`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};

export const getChatTextsApi = async (token) => {
  return axios({
    method: 'get',
    url: `${apiUrl}/chats`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};
