import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, Text, Button } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, formStyles } from '../styles/Styles';

export default function Profile (props) {

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
