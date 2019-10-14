import getEnvVars from '../environment';
const { apiUrl } = getEnvVars();
import axios from 'axios';

console.log(apiUrl, 'URL!!!!');

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
      return err.response.data || err;
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
      return err.response.data || err;
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
