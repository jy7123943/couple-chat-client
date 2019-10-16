
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, Text, Button } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, formStyles } from '../../styles/Styles';

export default function ChatRoom (props) {

  return (
    <View style={styles.container}>
      <View>
        <Text>ChatRoom</Text>
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
