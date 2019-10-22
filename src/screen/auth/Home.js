import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { commonStyles } from '../../styles/Styles';
import { Button, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { getUserRoomInfoApi } from '../../../utils/api';

export default function Home (props) {
  const {
    navigation,
    screenProps
  } = props;

  useEffect(() => {
    const authenticateUser = async (navigation, setUserInfo, setRoomInfo) => {
      // await SecureStore.deleteItemAsync('userInfo');
      const userInfoString = await SecureStore.getItemAsync('userInfo');

      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUserInfo(userInfo);

        const response = await getUserRoomInfoApi(userInfo.token);

        if (response.result === 'ok') {
          setRoomInfo(response.roomInfo);
          return navigation.navigate('Main');
        }

        if (response.result === 'not found') {
          return navigation.navigate('CoupleConnect');
        }
      }
      return navigation.navigate('Home');
    };

    if (screenProps.userInfo) {
      return navigation.navigate('CoupleConnect');
    }

    if (screenProps.roomInfo) {
      return navigation.navigate('Main');
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
          source={require('../../../assets/couple2.jpg')}
          style={styles.mainImage}
        />
        <Button
          block
          rounded
          style={{
            ...styles.joinButton,
            ...commonStyles.darkBtn
          }}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text>회원가입</Text>
        </Button>
        <Button
          block
          rounded
          style={commonStyles.lightBtn}
          onPress={() => navigation.navigate('Login')}
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
    marginBottom: 80,
    borderRadius: 25
  }
});
