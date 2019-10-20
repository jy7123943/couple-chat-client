import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Modal, Linking } from 'react-native';
import { Text, Button, List, ListItem } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { commonStyles } from '../../styles/Styles';

export default function ProfileModal (props) {
  const {
    onModalClose,
    isModalVisible,
    userProfile
  } = props;

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
      <View style={{flex: 2}}>
        <Image
          source={userProfile.profileImageUrl ?
            { uri: userProfile.profileImageUrl } :
            require('../../../assets/profile.jpg')
          }
          style={styles.imageBox}
        />
      </View>
      <List style={styles.list}>
        <ListItem
          style={{
            ...commonStyles.textCenter,
            ...styles.listItem
          }}
        >
          <Text style={styles.title}>
            {userProfile.name}
          </Text>
        </ListItem>
        <ListItem
          style={{
            ...commonStyles.textCenter,
            ...styles.listItem
          }}
        >
          <Text style={styles.infoText}>
            {moment(userProfile.birthday).locale('ko').format('YYYY MMM Do dddd')}
          </Text>
        </ListItem>
        <ListItem
          style={{
            ...commonStyles.textCenter,
            ...styles.listItem
          }}
          onPress={() => {
            Linking.openURL(`tel:${userProfile.phoneNumber}`);
          }}
        >
          <Text style={styles.infoText}>
            {userProfile.phoneNumber}
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
    marginBottom: 20
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
  }
});
