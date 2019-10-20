import React, { useState } from 'react';
import { StyleSheet, View, Image, Modal, Linking } from 'react-native';
import { Text, Button, List, ListItem, Fab } from 'native-base';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import moment from 'moment';
import { commonStyles } from '../../styles/Styles';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { profileImgModifyApi } from '../../../utils/api';
import { createImageForm } from '../../../utils/utils';
import * as SecureStore from 'expo-secure-store';

export default function ProfileModal (props) {
  const {
    onModalClose,
    isModalVisible,
    userProfile,
    isUser,
    userInfo,
    onUserProfileUpdate,
    setUserInfo
  } = props;

  const [ isFabActive, setFabActive ] = useState(false);

  const profile = isUser ? userProfile.user : userProfile.partner;

  const onImageUpload = async (profileImageUri) => {
    try {
      const imgFormData = createImageForm(profileImageUri);
      const response = await profileImgModifyApi(imgFormData, userInfo.token);

      if (response.result === 'ok') {
        const newUser = {
          ...userProfile.user,
          profileImageUrl: response.profileImageUrl
        };
        onUserProfileUpdate(newUser, userProfile.partner);
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

      console.log(imageFile.uri);
      onImageUpload(imageFile.uri);
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

  // const onLogout = async () => {
  //   await SecureStore.deleteItemAsync('userInfo');
  //   setUserInfo(null);
  //   onModalClose(false);
  // };

  console.log('MODAL:',userProfile)

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalVisible}
    >
      <Button
        transparent
        onPress={() => {
          console.log('닫기')
          onModalClose(false);
        }}
        style={styles.closeBtn}
      >
        <AntDesign
          name="close"
          size={30}
          color="#fff"
        />
      </Button>
      <View style={{
        flex: 3,
        position: 'relative'
      }}>
        <Image
          source={profile.profileImageUrl ?
            { uri: profile.profileImageUrl } :
            require('../../../assets/profile.jpg')
          }
          style={styles.imageBox}
        />
        {isUser && (
          <Fab
            active={isFabActive}
            direction="left"
            position="bottomRight"
            style={{ backgroundColor: '#cbcbf8' }}
            onPress={() => setFabActive(!isFabActive)}
          >
            <Feather name="more-vertical" />
            <Button
              style={styles.fabBtn}
              onPress={onImageSearch}
            >
              <Entypo
                name="camera"
                color="#fff"
                size={20}
              />
            </Button>
            <Button
              style={styles.fabBtn}
              // onPress={onLogout}
            >
              <AntDesign
                name="logout"
                color="#fff"
                size={20}
              />
            </Button>
          </Fab>
        )}
      </View>
      <List style={styles.list}>
        <ListItem
          style={{
            ...commonStyles.textCenter,
            ...styles.listItem
          }}
        >
          <Text style={styles.title}>
            {profile.name}
          </Text>
        </ListItem>
        <ListItem
          style={{
            ...commonStyles.textCenter,
            ...styles.listItem
          }}
        >
          <Text style={styles.infoText}>
            {moment(profile.birthday).locale('ko').format('YYYY MMM Do dddd')}
          </Text>
        </ListItem>
        <ListItem
          style={{
            ...commonStyles.textCenter,
            ...styles.listItem
          }}
          onPress={() => {
            Linking.openURL(`tel:${profile.phoneNumber}`);
          }}
        >
          <Text style={styles.infoText}>
            {profile.phoneNumber}
          </Text>
        </ListItem>
      </List>
    </Modal>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    width: '100%',
    height: '100%'
  },
  closeBtn: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 50,
    height: 50,
    zIndex: 1
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40
  },
  infoText: {
    color: '#999',
    fontSize: 16
  },
  list: {
    flex: 1,
    padding: 30,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  listItem: {
    marginTop: 5,
    marginLeft: 0,
    borderBottomColor: 'transparent'
  },
  fabBtn: {
    backgroundColor: '#afafc7',
  }
});
