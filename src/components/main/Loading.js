import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Text, Spinner } from 'native-base';
import { commonStyles } from '../../styles/Styles';

export default function Loading () {
  return (
    <Modal>
      <View style={styles.container}>
        <Text
          style={{
            ...commonStyles.txtBlue,
            ...styles.loading
          }}
        >
          LOADING
        </Text>
        <Spinner color="#5f7daf" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afafc7'
  },
  loading: {
    fontSize: 25,
    fontWeight: 'bold'
  }
});
