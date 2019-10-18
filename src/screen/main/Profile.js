import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, Text, Button } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, formStyles } from '../../styles/Styles';
import { getUserInfoApi } from '../../../utils/api';
import {
  Notifications
} from 'expo';

export default function Profile (props) {
  const {
    navigation,
    screenProps: {
      onLoadUserProfile,
      userProfile,
      userInfo
    }
  } = props;
  // console.log(userProfile, 'state: userProfile');

  useEffect(() => {
    const onLoad = async () => {
      try {
        const user = await getUserInfoApi(userInfo.token);
        onLoadUserProfile(user);
      } catch (err) {
        console.log(err);
      }
    };

    onLoad();

    _notificationSubscription = Notifications.addListener((notification) => {
      if (notification.origin === 'received') {
        navigation.navigate('ChatRoom');
      }
      console.log('NOTI!!!!!:',notification);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text>Profile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  }
});
