import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Home from '../screen/auth/Home';
import SignUp from '../screen/auth/SignUp';
import Login from '../screen/auth/Login';
import ProfileUpload from '../screen/auth/ProfileUpload';
import CoupleConnect from '../screen/auth/CoupleConnect';
import Main from '../screen/main/Main';

const Auth = createSwitchNavigator({
  Home,
  SignUp,
  Login,
  ProfileUpload,
  CoupleConnect,
  Main
}, {
  initialRouteName: 'Home'
});

export default createAppContainer(Auth);
