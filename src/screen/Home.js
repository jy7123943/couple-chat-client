import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { commonStyles } from '../styles/Styles';
import { authenticateUser } from '../../utils/api';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home (props) {
  const { navigation } = props;
  const [ token, setToken ] = useState(null);
  const [ partner, setPartner ] = useState(null);

  // useEffect(() => {
    // if (token) {
    //   navigatrion.navigate('CoupleConnect');
    // }
    // authenticateUser(navigation, setToken, setPartner);
  // }, [ authenticateUser, token ]);

  return (
    <LinearGradient
      colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
      style={{
        ...commonStyles.container,
        ...styles.container
      }}
    >
      <View style={styles.viewWrapper}>
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
  }
});
