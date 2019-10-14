import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { commonStyles } from '../styles/Styles';
import { Button, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

export default function Home (props) {
  const {
    navigation,
    screenProps
  } = props;

  useEffect(() => {
    const authenticateUser = async (navigation, setUserInfo, setRoomInfo) => {
      // await SecureStore.deleteItemAsync('userInfo');
      // await SecureStore.deleteItemAsync('roomInfo');
      const userInfo = await SecureStore.getItemAsync('userInfo');
      const roomInfo = await SecureStore.getItemAsync('roomInfo');
      console.log(userInfo, 'userInfo----------------');
      console.log(roomInfo, 'roomInfo----------------')
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));

        if (roomInfo) {
          setRoomInfo(JSON.parse(roomInfo));
          return navigation.navigate('Profile');
        }
        return navigation.navigate('CoupleConnect');
      }
      return navigation.navigate('Home');
    };

    if (screenProps.userInfo) {
      return navigation.navigate('CoupleConnect');
    }
    if (screenProps.roomInfo) {
      return navigation.navigate('Profile');
    }

    authenticateUser(navigation, screenProps.setUserInfo, screenProps.setRoomInfo);
  }, []);

  return (
    <LinearGradient
      colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
      style={{
        ...commonStyles.container,
        ...styles.container
      }}
    >
      <View style={styles.viewWrapper}>
        <Image
          source={require('../../assets/couple2.jpg')}
          style={styles.mainImage}
        />
        <Button
          block
          rounded
          style={{
            ...styles.joinButton,
            ...commonStyles.darkBtn
          }}
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        >
          <Text>회원가입</Text>
        </Button>
        <Button
          block
          rounded
          style={commonStyles.lightBtn}
          onPress={() => {
            navigation.navigate('Login');
          }}
        >
          <Text>로그인</Text>
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    paddingBottom: 100
  },
  joinButton: {
    marginBottom: 10
  },
  viewWrapper: {
    justifyContent: 'flex-end'
  },
  mainImage: {
    width: '100%',
    height: 350,
    borderRadius: 25,
    marginBottom: 80
  }
});
