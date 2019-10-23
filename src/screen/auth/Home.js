import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { commonStyles } from '../../styles/Styles';
import { Button, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

export default function Home (props) {
  const {
    navigation,
    screenProps: {
      setRoomInfo,
      setUserInfo,
      api
    }
  } = props;
  let isMounted = false;

  useEffect(() => {
    isMounted = true;

    const authenticateUser = async (navigation, setUserInfo, setRoomInfo) => {
      try {
        const userInfoString = await SecureStore.getItemAsync('userInfo');

        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          isMounted && setUserInfo(userInfo);

          const response = await api.getUserRoomInfoApi(userInfo.token);

          if (response.result === 'ok') {
            isMounted && setRoomInfo(response.roomInfo);
            return navigation.navigate('Main');
          }

          if (response.result === 'not found') {
            return navigation.navigate('CoupleConnect');
          }
        }
      } catch (err) {
        console.log(err);
        Alert.alert(
          '실패',
          '다시 로그인해주세요',
          [{ text: '확인' }]
        );
        return navigation.navigate('Login');
      }
    };

    if (isMounted) {
      authenticateUser(navigation, setUserInfo, setRoomInfo);
    }

    return () => {
      isMounted = false;
    }
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
