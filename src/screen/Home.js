import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Home (props) {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <View>
        <Text>로고 이미지 들어갈 자리입니다.</Text>
      </View>
      <Button
        title="회원가입"
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      />
      <Button
        title="로그인"
        onPress={() => {
          navigation.navigate('Login');
        }}
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
