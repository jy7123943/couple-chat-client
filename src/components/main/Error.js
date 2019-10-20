import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Button, Text } from 'native-base';
import { commonStyles } from '../../styles/Styles';
import { MaterialIcons } from '@expo/vector-icons';

export default function Error () {
  return (
    <Modal>
      <View style={styles.container}>
        <Text style={{
          ...commonStyles.txtBlue,
          ...styles.title
        }}>
          Sorry,
        </Text>
        <Text style={{
          ...commonStyles.txtBlue,
          ...styles.error
        }}>
          Something went wrong.
        </Text>
        <Button
          rounded
          style={styles.errorBtn}
        >
          <MaterialIcons
            name="refresh"
            color="#fff"
            size={30}
          />
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#afafc7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  error: {
    fontSize: 20
  },
  errorBtn: {
    marginTop: 20,
    width: 50,
    height: 50,
    justifyContent: 'center'
  }
});
