import React, { useState, useRef } from 'react';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import t from 'tcomb-form-native';
import { StyleSheet, View, Image, Modal, Linking, Alert } from 'react-native';
import { Text, Button, List, ListItem, Fab } from 'native-base';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { commonStyles, formStyles } from '../../styles/Styles';
import { createImageForm } from '../../../utils/utils';
import { REGEX_NAME, REGEX_PHONE_NUM, REGEX_PERSONAL_MESSAGE, EDIT_FORM_CONFIG } from '../../../utils/validation';
import * as SecureStore from 'expo-secure-store';

export default function ProfileModal (props) {
  const {
    onModalClose,
    isModalVisible,
    userProfile,
    isUser,
    userInfo,
    onUserProfileUpdate,
    homeNavigation,
    api
  } = props;

  const Form = t.form.Form;

  const [ isFabActive, setFabActive ] = useState(false);
  const [ isEditMode, setEditMode ] = useState(false);

  const options = {
    stylesheet: formStyles,
    fields: EDIT_FORM_CONFIG
  };

  const EDIT_TYPE = t.struct({
    name: REGEX_NAME,
    phone_number: t.maybe(REGEX_PHONE_NUM),
    personal_message: t.maybe(REGEX_PERSONAL_MESSAGE)
  });

  const profile = isUser ? userProfile.user : userProfile.partner;

  const onImageUpload = async (profileImageUri) => {
    try {
      const imgFormData = createImageForm(profileImageUri);
      const response = await api.profileImgModifyApi(imgFormData, userInfo.token);

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

  const onLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userInfo');
    } catch (err) {
      return Alert.alert(
        '실패',
        '다시 시도해주세요.',
        [{ text: '확인' }]
      );
    }
    homeNavigation.navigate('Main', {
      login: true
    });
  };

  const formRef = useRef(null);
  const handleSubmit = async () => {
    const formValue = formRef.current.getValue();

    if (!formValue) {
      return;
    }

    const response = await api.modifyProfileApi(userInfo.token, formValue);

    setEditMode(false);
    if (response.validationError) {
      return Alert.alert(
        '실패',
        response.validationError,
        [{ text: '확인' }]
      );
    }

    if (response.result !== 'ok') {
      return Alert.alert(
        '실패',
        '프로필 편집에 실패했습니다.',
        [{ text: '확인' }]
      );
    }

    const newUser = {
      ...userProfile.user,
      name: formValue.name,
      personalMessage: formValue.personal_message,
      phoneNumber: formValue.phone_number
    };

    onUserProfileUpdate(newUser, userProfile.partner);
  };

  const cancelSubmit = () => {
    setEditMode(false);
  };

  const DEFAULT_VALUE = {
    name: profile.name,
    phone_number: profile.phoneNumber,
    personal_message: profile.personalMessage ? profile.personalMessage : ''
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalVisible}
    >
      <Button
        transparent
        onPress={() => onModalClose(false)}
        style={styles.closeBtn}
      >
        <AntDesign
          name="close"
          size={30}
          color="#fff"
        />
      </Button>
      <View style={styles.modalWrap}>
        <Text style={styles.personalMessage}>
          {!!profile.personalMessage && profile.personalMessage}
        </Text>
        <Image
          source={profile.profileImageUrl ?
            { uri: profile.profileImageUrl } :
            require('../../../assets/profile.jpg')
          }
          style={styles.imageBox}
        />
        {isUser && (
          <>
            <Button
              style={styles.logoutBtn}
              onPress={onLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </Button>
            <Fab
              active={isFabActive}
              direction="left"
              position="bottomRight"
              style={styles.fabBigBtn}
              onPress={() => setFabActive(!isFabActive)}
            >
              <Feather name="more-vertical" />
              {!isEditMode && (
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
              )}
              {!isEditMode ? (
                <Button
                  style={styles.fabBtn}
                  onPress={() => setEditMode(!isEditMode)}
                >
                  <AntDesign
                    name="edit"
                    color="#fff"
                    size={20}
                  />
                </Button>
              ) : (
                <Button
                  style={{
                    ...styles.fabBtn,
                    backgroundColor: '#ffc31a'
                  }}
                  onPress={handleSubmit}
                >
                  <AntDesign
                    name="check"
                    color="#fff"
                    size={20}
                  />
                </Button>
              )}
              {isEditMode && (
                <Button
                  style={styles.fabBtn}
                  onPress={cancelSubmit}
                >
                  <AntDesign
                    name="close"
                    color="#fff"
                    size={20}
                  />
                </Button>
              )}
            </Fab>
          </>
        )}
      </View>
      {!isEditMode && (
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
            onPress={() => Linking.openURL(`tel:${profile.phoneNumber}`)}
          >
            <Text style={styles.infoText}>
              {profile.phoneNumber}
            </Text>
          </ListItem>
        </List>
      )}
      {isEditMode && (
        <View style={styles.formWrap}>
          <Form
            type={EDIT_TYPE}
            options={options}
            value={DEFAULT_VALUE}
            ref={formRef}
          />
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrap: {
    flex: 2,
    position: 'relative'
  },
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
    zIndex: 10
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#666',
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
  fabBigBtn: {
    backgroundColor: '#cbcbf8',
    zIndex: 10
  },
  fabBtn: {
    backgroundColor: '#afafc7',
    justifyContent: 'center',
    zIndex: 10
  },
  personalMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    zIndex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  formWrap: {
    padding: 30,
    paddingTop: 20,
    paddingBottom: 20
  },
  logoutBtn: {
    position: 'absolute',
    bottom: 90,
    right: 5,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#f7eed3',
    justifyContent: 'center',
    zIndex: 10
  },
  logoutText: {
    fontSize: 14,
    color: '#afafc7'
  }
});
