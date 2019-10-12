import React, { Component } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './src/screen/Home';
import SignUp from './src/screen/SignUp';
import Login from './src/screen/Login';
import ProfileUpload from './src/screen/ProfileUpload';
import CoupleConnect from './src/screen/CoupleConnect';

const App = createStackNavigator({
  Home: { screen: Home },
  SignUp: { screen: SignUp },
  Login: { screen: Login },
  ProfileUpload: { screen: ProfileUpload },
  CoupleConnect: { screen: CoupleConnect }
}, {
  initialRouteName: 'Home', headerMode: 'none'
});

const AppContainer = createAppContainer(App);

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

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
      <AppContainer />
    );
  }
}
