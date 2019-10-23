import React, { useState } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Header, Text, Button } from 'native-base';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { createImageForm } from '../../../utils/utils';
import { commonStyles } from '../../styles/Styles';

export default function ProfileUpload (props) {
  const {
    navigation,
    screenProps: {
      userInfo,
      api
    }
  } = props;
  const [ profileImageUri, setProfileImageUri ] = useState(null);

  const onImageSearch = async () => {
    try {
      const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (newPermission.status !== 'granted') {
          throw new Error('permission not granted');
        }
      }

      const imageFile = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        base64: true,
        quality: 1
      });

      if (imageFile.cancelled) {
        return;
      }

      setProfileImageUri(imageFile.uri);
    } catch (err) {
      console.log(err);
      if (err.message === 'permission not granted') {
        return Alert.alert(
          '안내',
          '카메라 앨범 접근 권한이 필요합니다.',
          [{ text: '확인' }]
        );
      }
      return Alert.alert(
        '실패',
        '다시 시도해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  const onImageUpload = async () => {
    try {
      const imgFormData = createImageForm(profileImageUri);

      const response = await api.profileImgUploadApi(imgFormData, userInfo.token);

      if (response.result !== 'ok') {
        throw new Error('image upload failed');
      }

      navigation.navigate('CoupleConnect');
    } catch (err) {
      console.log(err);
      return Alert.alert(
        '업로드 실패',
        '잠시후 다시 시도해주세요',
        [{ text: '확인' }]
      );
    }
  };

  return (
    <LinearGradient
      colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
      style={commonStyles.container}
    >
      <Header style={commonStyles.header}>
        <Text style={commonStyles.txtBlue}>
          프로필 사진 올리기
        </Text>
      </Header>
      <View>
        <Image
          source={profileImageUri ?
            { uri: profileImageUri } :
            require('../../../assets/profile.jpg')
        }
          style={styles.imageBox}
        />
        <Button
          block
          rounded
          onPress={onImageSearch}
          style={{
            ...commonStyles.lightBtn,
            ...styles.uploadBtn
          }}
        >
          <Text>사진 선택</Text>
        </Button>
        {profileImageUri && (
          <Button
            block
            rounded
            onPress={onImageUpload}
            style={{
              ...commonStyles.darkBtn,
              ...styles.uploadBtn
            }}
          >
            <Text>올리기</Text>
          </Button>
        )}
        <Button
          block
          transparent
          onPress={() => navigation.navigate('CoupleConnect')}
        >
          <Text>나중에 하기</Text>
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    width: '100%',
    height: 300,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10
  },
  uploadBtn: {
    marginBottom: 10
  }
});
