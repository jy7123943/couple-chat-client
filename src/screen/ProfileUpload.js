import React, { useState } from 'react';
import { StyleSheet, View, Button, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileUpload (props) {
  const [ profileImageUri, setProfileImageUri ] = useState(null);

  const onImageUpload = async () => {
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
      console.log(imageFile.uri);

      const localUri = imageFile.uri;
      const filename = localUri.split('/').pop();

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('profile_image_url', { uri: localUri, name: filename, type });

      // fetch('http://192.168.0.72:3000/imageUpload', {
      //   method: 'POST',
      //   header: {
      //     'content-type': 'multipart/form-data',
      //   },
      //   body: formData
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
      setProfileImageUri(imageFile.uri);

    } catch (err) {
      if (err.message === 'permission not granted') {
        alert('카메라 앨범 접근 권한이 필요합니다.');
        return;
      }
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={profileImageUri ? profileImageUri : require('../../assets/profile.jpg')}
        style={{ width: 100, height: 100 }}
      />
      <Button
        title="이미지 업로드"
        onPress={onImageUpload}
      />
      <Button
        title="나중에 하기"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
