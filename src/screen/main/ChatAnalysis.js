
import React, { useState } from 'react';
import { StyleSheet, View, Image, Alert, ScrollView } from 'react-native';
import { Header, Text, Button, Spinner } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../../styles/Styles';
import { getChatAnalysisApi } from '../../../utils/api';
import * as SecureStore from 'expo-secure-store';

export default function ChatAnalysis (props) {
  const {
    navigation,
    screenProps: {
      userInfo,
      userProfile: { user },
      onLoadAnalysisResult
    }
  } = props;

  const [ isLoading, setLoading ] = useState(false);

  const handleBtnPress = async () => {
    try {
      setLoading(true);
      const response = await getChatAnalysisApi(userInfo.token);

      if (response.error) {
        Alert.alert(
          '실패',
          response.error,
          [{ text: '확인' }]
        );
        return setLoading(false);
      }

      if (response.result !== 'ok') {
        throw new Error('chat analysis failed');
      }

      await SecureStore.setItemAsync('analysisResult', JSON.stringify(response.analysis_report));
      onLoadAnalysisResult(response.analysis_report);
      setLoading(false);

      navigation.navigate('ChatAnalysisResult');
    } catch (err) {
      console.log(err);
      setLoading(false);
      Alert.alert(
        '실패',
        '대화 분석에 실패했습니다. 나중에 시도해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  return (
    <LinearGradient
      colors={['#f7eed3', '#cbcbf8', '#afafc7']}
      style={commonStyles.container}
    >
      <Header style={commonStyles.header}>
        <Text style={commonStyles.txtBlue}>
          대화 분석
        </Text>
      </Header>
      <View style={styles.container}>
        <View>
          <Image
            source={require('../../../assets/couple_illust.png')}
            style={styles.mainImage}
          />
        </View>
        <ScrollView style={{flex: 1}}>
          <Text
            style={styles.title}
          >
            대화로 분석하는 연애 점수
          </Text>
          <Text
            style={styles.description}
          >
            {user.name}님 커플은 얼마나 대화를 자주 하고 있을까요? 최근 30일 동안의 채팅 대화들을 분석하여 {user.name}님 커플의 연애 점수를 알려드립니다.
          </Text>
          {isLoading && (
            <Spinner color="#5f7daf" />
          )}
        </ScrollView>
        <Button
          block
          rounded
          style={{ backgroundColor: '#907af0' }}
          onPress={handleBtnPress}
        >
          <Text>지금 분석하기</Text>
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  },
  mainImage: {
    width: '100%',
    height: 250,
    marginTop: 30
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25
  },
  description: {
    width: '100%',
    padding: 20,
    textAlign: 'center',
    fontSize: 18
  }
});
