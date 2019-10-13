import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();
import t from 'tcomb-form-native';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, View, Alert } from 'react-native';
import { Header, Text, Button, Spinner } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, formStyles } from '../styles/Styles';
const socket = io(apiUrl);

export default function CoupleConnect (props) {
  const { navigation, screenProps } = props;
  const [ isLoading, setLoading ] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('waitingPartner', () => {
      setLoading(true);
    });

    socket.on('partnerNotMatched', () => {
      setLoading(false);
      Alert.alert(
        '연결 실패',
        '다시 시도해주세요',
        [{ text: '확인' }]
      );
    });

    socket.on('completeConnection', async (roomInfo) => {
      setLoading(false);
      // console.log('RoomInfo=============',roomInfo);
      await SecureStore.setItemAsync('roomInfo', JSON.stringify(roomInfo));

      screenProps.setRoomInfo(roomInfo);
      navigation.navigate('Profile');
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect(true);
    }
  }, []);

  const Form = t.form.Form;
  const Type = t.struct({
    partnerId: t.String
  });

  const options = {
    stylesheet: formStyles,
    fields: {
      partnerId: {
        label: '상대방의 아이디',
        error: '상대방의 아이디를 입력해주세요',
        autoCapitalize: 'none'
      }
    }
  };

  const formRef = useRef(null);
  const handleSubmit = async () => {
    var formValue = formRef.current.getValue();

    if (!formValue) {
      return;
    }

    const { partnerId } = formValue;
    const userId = screenProps.userInfo && screenProps.userInfo.userId;

    if (partnerId === userId) {
      return Alert.alert(
        '연결 실패',
        '상대방의 아이디를 입력해주세요',
        [{ text: '확인' }]
      );
    }

    socket.emit('requestConnection', userId, partnerId);
  };

  const handleCancel = () => {
    const userId = screenProps.userInfo && screenProps.userInfo.userId;
    socket.emit('cancelConnection', userId);
    setLoading(false);
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
        style={commonStyles.container}
      >
        <View style={styles.container}>
          <Spinner color='#5f7daf' />
          <Button
            block
            rounded
            style={{
              ...commonStyles.lightBtn,
              ...commonStyles.marginTopMd
            }}
            onPress={handleCancel}
          >
            <Text>요청 취소</Text>
          </Button>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
      style={commonStyles.container}
    >
      <Header style={commonStyles.header}>
        <Text style={commonStyles.txtBlue}>
          연인과 연결하기
        </Text>
      </Header>
      <View style={styles.container}>
        <Form
          type={Type}
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
          <Text>요청 보내기</Text>
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
