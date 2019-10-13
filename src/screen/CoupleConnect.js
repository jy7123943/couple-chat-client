import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();
import { StyleSheet, View } from 'react-native';
import { Header, Text, Button } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, formStyles } from '../styles/Styles';

export default function CoupleConnect (props) {
  useEffect(() => {
    const socket = io(apiUrl);

    socket.on('connect', () => {
      console.log('connected');
      socket.emit('hello');
    });
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text>Couple Connect</Text>
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
