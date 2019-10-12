import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Alert } from 'react-native';
import t from 'tcomb-form-native';
import {
  REGEX_ID,
  REGEX_PASSWORD,
  REGEX_NAME,
  REGEX_PHONE_NUM,
  FORM_CONFIG
} from '../../utils/validation';
import { signUpApi } from '../../utils/api';

const Form = t.form.Form;

type Props = {}
type State = {
  value: Object,
  options: Object
}
export default class SignUp extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      value: {},
      options: {
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
      const response = await signUpApi(formValue);
      console.log('RESPONSE', response);

      if (response.validationError) {
        Alert.alert(
          '회원가입 실패',
          response.validationError,
          [{ text: '확인' }]
        );
        return;
      }

      if (response.result === 'ok') {
        Alert.alert(
          '축하합니다!',
          '회원가입이 완료되었습니다.',
          [{ text: '확인' }]
        );
      }

      navigation.navigate('ProfileUpload');
    } catch(err) {
      console.log(err);
      this.clearForm();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>회원가입</Text>
        </View>
        <ScrollView>
          <Form
            ref="form"
            type={this.User}
            value={this.state.value}
            options={this.state.options}
            onChange={this.onChange}
          />
        </ScrollView>
        <Button
          title="다음"
          onPress={this.handleSubmit}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    paddingTop: 10
  }
});
