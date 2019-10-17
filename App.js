import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AuthNavigator from './src/screen/auth/AuthNavigator';
import io from 'socket.io-client';
import getEnvVars from './environment';
const { apiUrl } = getEnvVars();

YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
const socketConfig = {
  'force new connection' : true,
  'reconnection': true,
  'reconnectionDelay': 2000,
  'reconnectionDelayMax' : 60000,
  'reconnectionAttempts': 'Infinity',
  'timeout' : 10000,     
  transports: ['websocket'],
  upgrade: false
};
const socket = io(apiUrl, socketConfig);
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
      <AuthNavigator
        screenProps={{
          ...this.state,
          socket,
          setRoomInfo: this.setRoomInfo,
          setUserInfo: this.setUserInfo
        }}
      />
    );
  }
}
