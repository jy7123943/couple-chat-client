import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { commonStyles } from '../styles/Styles';
import { Button, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
// import Icon from 'react-native-vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';

export default function Home (props) {
  const {
    navigation,
    screenProps
  } = props;

  useEffect(() => {
    const authenticateUser = async (navigation, setToken, setPartner, setUserId) => {
      const token = await SecureStore.getItemAsync('token');
      const userId = await SecureStore.getItemAsync('userId');
      const partner = await SecureStore.getItemAsync('partner');

      if (token && userId) {
        if (partner) {
          setPartner(partner);
          return navigation.navigate('Profile');
        }
        setToken(token);
        setUserId(userId);
        return navigation.navigate('CoupleConnect');
      }

      navigation.navigate('Home');
    };

    if (screenProps.token) {
      return navigation.navigate('CoupleConnect');
    }
    authenticateUser(
      navigation,
      screenProps.setToken,
      screenProps.setPartner,
      screenProps.setUserId
    );
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
