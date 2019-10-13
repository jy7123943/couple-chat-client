import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Home from './src/screen/Home';
import SignUp from './src/screen/SignUp';
import Login from './src/screen/Login';
import ProfileUpload from './src/screen/ProfileUpload';
import CoupleConnect from './src/screen/CoupleConnect';
import Profile from './src/screen/Profile';

YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const App = createSwitchNavigator({
  Home,
  SignUp,
  Login,
  ProfileUpload,
  CoupleConnect,
  Profile
}, {
  initialRouteName: 'Home',
});

const AppContainer = createAppContainer(App);

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      userInfo: null,
      roomInfo: null
    };
  }

  setUserInfo = (userInfo) => {
    this.setState({
      ...this.state,
      userInfo
    });
  };

  setRoomInfo = (roomInfo) => {
    this.setState({
      ...this.state,
      roomInfo
    });
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <AppContainer
        screenProps={{
          ...this.state,
          setRoomInfo: this.setRoomInfo,
          setUserInfo: this.setUserInfo
        }}
      />
    );
  }
}
