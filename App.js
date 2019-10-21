import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AuthNavigator from './src/screen/auth/AuthNavigator';

YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      userInfo: null,
      roomInfo: null
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font
    });
    this.setState({ isReady: true });
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

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <AuthNavigator
        screenProps={{
          ...this.state,
          setRoomInfo: this.setRoomInfo,
          setUserInfo: this.setUserInfo
        }}
      />
    );
  }
}
