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
  try {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // if (existingStatus !== 'granted') {
    //   // Android remote notification permissions are granted during the app
    //   // install, so this will only ask on iOS
    //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   finalStatus = status;
    // }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      throw new Error('permission not granted');
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();
    return console.log('PUSHTOKeN', pushToken);
    return axios({
      method: 'put',
      url: `${apiUrl}/users/pushToken`,
      data: pushToken,
      headers: {
        'Content-Type': 'multipart/form-data',
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
