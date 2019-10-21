import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import { Alert } from 'react-native';
import getEnvVars from '../environment';
const { apiUrl } = getEnvVars();

export const signUpApi = (user) => {
  return axios({
    method: 'post',
    url: `${apiUrl}/signUp`,
    data: { ...user }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};

export const loginApi = (id, password) => {
  return axios({
    method: 'post',
    url: `${apiUrl}/login`,
    data: { id, password }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};

export const profileImgUploadApi = (imgFormData, token) => {
  return axios({
    method: 'post',
    url: `${apiUrl}/profileImage`,
    data: imgFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};

export const profileImgModifyApi = (imgFormData, token) => {
  return axios({
    method: 'put',
    url: `${apiUrl}/profileImage`,
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
  try {
    let { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      status = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (status !== 'granted') {
        throw new Error('permission not granted');
      }
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();
    await Notifications.createChannelAndroidAsync('chat-messages', {
      name: 'Chat messages',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250]
    });

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

export const getUserInfoApi = (token) => {
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

export const getUserRoomInfoApi = (token) => {
  return axios({
    method: 'get',
    url: `${apiUrl}/users/room`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};

export const getChatTextsApi = (token) => {
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

export const getChatAnalysisApi = (token) => {
  return axios({
    method: 'post',
    url: `${apiUrl}/chats/analysis`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
};
