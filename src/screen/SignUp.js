import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Header, Text, Button } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, formStyles } from '../styles/Styles';
import * as SecureStore from 'expo-secure-store';
import t from 'tcomb-form-native';
import {
  REGEX_ID,
  REGEX_PASSWORD,
  REGEX_NAME,
  REGEX_PHONE_NUM,
  FORM_CONFIG
} from '../../utils/validation';
import { signUpApi, loginApi } from '../../utils/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Form = t.form.Form;

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {},
      options: {
        stylesheet: formStyles,
        fields: { ...FORM_CONFIG }
      }
    };
  }

  checkPasswordConfirmation = t.refinement(t.String, (passwordConfirm) => {
    return passwordConfirm == this.state.value.password;
  });

  User = t.struct({
    id: REGEX_ID,
    password: REGEX_PASSWORD,
    password_confirm: this.checkPasswordConfirmation,
    name: REGEX_NAME,
    phone_number: t.maybe(REGEX_PHONE_NUM),
    birthday: t.maybe(t.Date),
    first_meet_day: t.Date
  });

  onChange = (value) => {
    this.setState({ value });
  };

  clearForm = () => {
    this.setState({ value: null });
  };

  handleSubmit = async () => {
    const { navigation } = this.props;

    var formValue = this.refs.form.getValue();
    console.log(formValue);
    if (!formValue) {
      return;
    }

    try {
      const joinResponse = await signUpApi(formValue);
      console.log('joinResponse', joinResponse);

      if (joinResponse.validationError) {
        Alert.alert(
          '회원가입 실패',
          joinResponse.validationError,
          [{ text: '확인' }]
        );
        return;
      }

      if (joinResponse.result === 'ok') {
        Alert.alert(
          '축하합니다!',
          '회원가입이 완료되었습니다.',
          [{ text: '확인' }]
        );

        const loginResponse = await loginApi(formValue.id, formValue.password);
        this.clearForm();

        if (loginResponse.loginError) {
          Alert.alert(
            '로그인 실패',
            '다시 시도해주세요',
            [{ text: '확인' }]
          );
          return navigation.navigate('Login');
        }

        if (loginResponse.result === 'ok') {
          await SecureStore.setItemAsync('token', loginResponse.token);
          await SecureStore.setItemAsync('userId', loginResponse.userId);
          return navigation.navigate('ProfileUpload');
        }
      }
    } catch(err) {
      console.log(err);
    }
  };

  render() {
    return (
      <LinearGradient
        colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
        style={commonStyles.container}
      >
        <Header style={commonStyles.header}>
          <Text style={commonStyles.txtBlue}>
            회원가입
          </Text>
        </Header>
        <View style={styles.scrollBox}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
          >
            <Form
              ref="form"
              type={this.User}
              value={this.state.value}
              options={this.state.options}
              onChange={this.onChange}
            />
          </KeyboardAwareScrollView>
        </View>
        <Button
          block
          rounded
          style={commonStyles.darkBtn}
          onPress={this.handleSubmit}
        >
          <Text>다음</Text>
        </Button>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  scrollBox: {
    paddingTop: 20,
    paddingBottom: 20,
    flex: 6
  }
});
