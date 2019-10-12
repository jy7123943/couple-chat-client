import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import t from 'tcomb-form-native';


export default function SignUp () {
  const Form = t.form.Form;
  const LoginType = t.struct({
    id: t.String,
    password: t.String
  });

  const options = {
    fields: {
      id: {
        label: '아이디'
      },
      password: {
        label: '비밀번호'
      }
    }
  };

  const handleSubmit = () => {

  };

  return (
    <View style={styles.container}>
      <View>
        <Text>로그인</Text>
      </View>
      <ScrollView>
        <Form type={LoginType} options={options} />
      </ScrollView>
      <Button
        title="로그인"
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  }
});
