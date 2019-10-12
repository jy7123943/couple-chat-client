import React, { useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Header, Text, Button } from 'native-base';
import t from 'tcomb-form-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, formStyles } from '../styles/Styles';
import { loginApi } from '../../utils/api';

export default function SignUp (props) {
  const Form = t.form.Form;
  const LoginType = t.struct({
    id: t.String,
    password: t.String
  });

  const options = {
    stylesheet: formStyles,
    fields: {
      id: {
        label: '아이디',
        error: '아이디를 입력해주세요'
      },
      password: {
        label: '비밀번호',
        error: '비밀번호를 입력해주세요'
      }
    }
  };

  const formRef = useRef(null);

  const handleSubmit = async () => {
    const { navigation } = props;

    var formValue = formRef.current.getValue();
    console.log('login: ',formValue);

    if (!formValue) {
      return;
    }

    const { id, password } = formValue;
    console.log(id, password);

    try {
      const loginResponse = await loginApi(id, password);
      console.log('loginResponse', loginResponse);

      if (loginResponse.Error || loginResponse === 'Unauthorized') {
        Alert.alert(
          '로그인 실패',
          '다시 시도해주세요',
          [{ text: '확인' }]
        );
        return navigation.navigate('Login');
      }

      if (loginResponse.result === 'ok') {
        await SecureStore.setItemAsync('token', loginResponse.token);
        return navigation.navigate('CoupleConnect');
      }
    } catch(err) {
      console.log(err);
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
          type={LoginType}
          options={options}
          ref={formRef}
        />
        <Button
          block
          rounded
          style={{
            ...commonStyles.lightBtn,
            ...commonStyles.marginTopMd
          }}
          onPress={handleSubmit}
        >
          <Text>로그인</Text>
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
