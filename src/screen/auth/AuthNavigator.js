import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import ProfileUpload from './ProfileUpload';
import CoupleConnect from './CoupleConnect';
import Main from '../main/Main';

const Auth = createSwitchNavigator({
  Home,
  SignUp,
  Login,
  ProfileUpload,
  CoupleConnect,
  Main,
}, {
  initialRouteName: 'Home',
});

export default createAppContainer(Auth);
