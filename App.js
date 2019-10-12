import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './src/screen/Home';
import SignUp from './src/screen/SignUp';
import Login from './src/screen/Login';
import ProfileUpload from './src/screen/ProfileUpload';

const App = createStackNavigator({
  Home: { screen: Home },
  SignUp: { screen: SignUp },
  Login: { screen: Login },
  ProfileUpload: { screen: ProfileUpload }
}, {
  initialRouteName: 'Home', headerMode: 'none'
});

export default createAppContainer(App);
