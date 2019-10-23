import React, { Component } from 'react';
import * as SecureStore from 'expo-secure-store';
import t from 'tcomb-form-native';
import { StyleSheet, View, Alert } from 'react-native';
import { Header, Text, Button, Left, Container, Right } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { commonStyles, formStyles } from '../../styles/Styles';
import { REGEX_ID, REGEX_PASSWORD, REGEX_NAME, REGEX_PHONE_NUM, FORM_CONFIG } from '../../../utils/validation';

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

  onChange = (value) => this.setState({ value });
  clearForm = () => this.setState({ value: null });

  handleSubmit = async () => {
    const {
      navigation,
      screenProps: {
        setUserInfo,
        api
      }
    } = this.props;

    var formValue = this.refs.form.getValue();

    if (!formValue) {
      return;
    }

    try {
      const joinResponse = await api.signUpApi(formValue);

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

        this.clearForm();

        try {
          const loginResponse = await api.loginApi(formValue.id, formValue.password);

          if (loginResponse.result !== 'ok') {
            throw new Error('login failed');
          }

          const { token, userId } = loginResponse;
          await SecureStore.setItemAsync('userInfo', JSON.stringify({ token, userId }));
          setUserInfo({ token, userId });

          const tokenSaveResult = await api.sendUserPushToken(token);
          if (tokenSaveResult.result !== 'ok') {
            throw new Error('login failed');
          }

          return navigation.navigate('ProfileUpload');
        } catch (err) {
          if (err.message === 'login failed') {
            Alert.alert(
              '로그인 실패',
              '다시 시도해주세요',
              [{ text: '확인' }]
            );
            return navigation.navigate('Login');
          }
        }
      }
    } catch(err) {
      console.log(err);
      Alert.alert(
        '회원가입 실패',
        '다시 시도해주세요',
        [{ text: '확인' }]
      );
      return navigation.navigate('SignUp');
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <LinearGradient
        colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
        style={commonStyles.container}
      >
        <Container style={commonStyles.headerContainer}>
          <Header style={commonStyles.header}>
            <Left
              style={commonStyles.rightTextBtn}
            >
              <Text style={commonStyles.txtBlue}>
                Join
              </Text>
            </Left>
            <Right>
              <Button
                transparent
                onPress={() => navigation.navigate('Login')}
              >
                <AntDesign
                  name="login"
                  color="#5f7daf"
                  size={15}
                />
              </Button>
            </Right>
          </Header>
        </Container>
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
    flex: 6,
    paddingTop: 20,
    paddingBottom: 20
  }
});
