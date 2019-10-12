import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Home (props) {
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
