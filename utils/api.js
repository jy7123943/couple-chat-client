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
