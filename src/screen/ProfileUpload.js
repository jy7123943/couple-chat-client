import React, { useState } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Header, Text, Button } from 'native-base';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { profileImgUploadApi } from '../../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../styles/Styles';

export default function ProfileUpload (props) {
  const { navigation } = props;
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
      

      // fetch('http://192.168.0.72:3000/imageUpload', {
      //   method: 'POST',
      //   header: {
      //     'content-type': 'multipart/form-data',
      //   },
      //   body: imgFormData
      // })
      //   .then(result => {
      //     if (result.ok) {
      //       setProfileImageUri(imageFile.uri);
      //       alert('이미지 업로드가 완료되었습니다');
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   })

    } catch (err) {
      if (err.message === 'permission not granted') {
        return Alert.alert(
          '실패',
          '카메라 앨범 접근 권한이 필요합니다.',
          [{ text: '확인' }]
        );
      }
      console.log(err);
    }
  };

  const onImageUpload = async () => {
    try {
      console.log(profileImageUri);

      const localUri = profileImageUri;
      const filename = localUri.split('/').pop();

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const imgFormData = new FormData();
      imgFormData.append('profile_image_url', { uri: localUri, name: filename, type });

      const response = await profileImgUploadApi(imgFormData);
      console.log('response!!',response);
      if (response.result === 'ok') {
        navigation.navigate('CoupleConnect');
      } else {
        throw new Error('image upload failed');
      }
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
          source={profileImageUri ? { uri: profileImageUri } : require('../../assets/profile.jpg')}
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
          onPress={() => {
            navigation.navigate('CoupleConnect');
          }}
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
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20
  },
  uploadBtn: {
    marginBottom: 10
  }
});
