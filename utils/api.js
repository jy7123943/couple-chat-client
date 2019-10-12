import getEnvVars from '../environment';
const { apiUrl } = getEnvVars();
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const authenticateUser = async (navigation, setToken, setPartner) => {
  const token = await SecureStore.getItemAsync('token');
  const partner = await SecureStore.getItemAsync('partner');

  if (token) {
    if (partner) {
      setPartner(partner);
      return navigation.navigate();
    }
    setToken(token);
    return navigation.navigate('CoupleConnect');
  }

  navigation.navigate('Home');
};

export const signUpApi = (user) => {
  return axios({
    method: 'post',
    url: `${apiUrl}/signUp`,
    data: {
      ...user
    }
  })
    .then(res => res.data)
    .catch(err => err.response.data);
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
    .catch(err => err.response.data);
};

export const profileImgUploadApi = async (imgFormData) => {
  const token = await SecureStore.getItemAsync('token');

  console.log('토큰!!!!!!', token);

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
