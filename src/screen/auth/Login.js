import React, { useState, useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Header, Text, Button, Spinner } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import t from 'tcomb-form-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginApi, sendUserPushToken } from '../../../utils/api';
import { commonStyles, formStyles } from '../../styles/Styles';

export default function SignUp (props) {
  const { navigation, screenProps } = props;
  const [ isLoading, setLoading ] = useState(false);
  const Form = t.form.Form;

  const LOGIN_TYPE = t.struct({
    id: t.String,
    password: t.String
  });

  const options = {
    stylesheet: formStyles,
    fields: {
      id: {
        label: '아이디',
        error: '아이디를 입력해주세요',
        autoCapitalize: 'none'
      },
      password: {
        label: '비밀번호',
        error: '비밀번호를 입력해주세요',
        password: true,
        secureTextEntry: true,
        autoCapitalize: 'none'
      }
    }
  };

  const formRef = useRef(null);

  const handleSubmit = async () => {
    const formValue = formRef.current.getValue();

    if (!formValue) {
      return;
    }

    const { id, password } = formValue;

    try {
      setLoading(true);
      const loginResponse = await loginApi(id, password);

      if (loginResponse === 'Unauthorized') {
        Alert.alert(
          '로그인 실패',
          '아이디나 비밀번호가 잘못되었습니다',
          [{ text: '확인' }]
        );
        setLoading(false);
        return navigation.navigate('Login');
      }

      if (loginResponse.result !== 'ok') {
        throw new Error('login failed');
      }

      const { token, userId } = loginResponse;
      await SecureStore.setItemAsync('userInfo', JSON.stringify({ token, userId }));
      screenProps.setUserInfo({ token, userId });

      const tokenSaveResult = await sendUserPushToken(token);

      if (tokenSaveResult.result !== 'ok') {
        throw new Error('pushtoken failed');
      }

      if (loginResponse.roomInfo) {
        screenProps.setRoomInfo(loginResponse.roomInfo);
        return navigation.navigate('Main');
      }

      setLoading(false);
      return navigation.navigate('CoupleConnect');
    } catch(err) {
      console.log(err);
      Alert.alert(
        '로그인 실패',
        '다시 시도해주세요',
        [{ text: '확인' }]
      );
      setLoading(false);
      return navigation.navigate('Login');
    }
  };

  return (
    <LinearGradient
      colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
      style={commonStyles.container}
    >
      <Header style={commonStyles.header}>
        <Text style={commonStyles.txtBlue}>
          로그인
        </Text>
      </Header>
      <View style={styles.container}>
        <Form
          type={LOGIN_TYPE}
          options={options}
          ref={formRef}
        />
        {isLoading && <Spinner color="#5f7daf" />}
        <Button
          block
          rounded
          style={{
            ...commonStyles.darkBtn,
            ...commonStyles.marginTopMd
          }}
          onPress={handleSubmit}
        >
          <Text>로그인</Text>
        </Button>
        <Button
          block
          rounded
          style={{
            ...commonStyles.lightBtn,
            ...commonStyles.marginTopSm
          }}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text>회원가입</Text>
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingTop: 40
  }
});
