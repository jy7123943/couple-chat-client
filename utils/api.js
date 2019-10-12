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
