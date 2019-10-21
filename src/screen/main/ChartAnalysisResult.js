
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Alert, ScrollView, CameraRoll } from 'react-native';
import { Container, Header, Text, Button, Content, ListItem } from 'native-base';
import PureChart from 'react-native-pure-chart';
import { SimpleLineIcons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import * as Permissions from 'expo-permissions';
import ViewShot from "react-native-view-shot";
import moment from 'moment';
import 'moment/min/locales';
import { commonStyles } from '../../styles/Styles';
import Loading from '../../components/main/Loading';

export default function ChatAnalysisResult (props) {
  const [ isLoading, setLoading ] = useState(true);

  const {
    screenProps: {
      userProfile: { user, partner },
      analysisResult,
      onLoadAnalysisResult
    }
  } = props;

  const scrollViewRef = useRef(null);

  useEffect(() => {
    try {
      const getStoredAnalysisResult = async () => {
        const result = await SecureStore.getItemAsync('analysisResult');

        if (result) {
          onLoadAnalysisResult(JSON.parse(result));
        }
        setLoading(false);
      };

      getStoredAnalysisResult();
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!analysisResult) {
    return (
      <LinearGradient
        colors={['#f7eed3', '#cbcbf8', '#afafc7']}
        style={commonStyles.container}
      >
        <View style={{
          ...commonStyles.container,
          ...commonStyles.textCenter
        }}>
          <Text style={commonStyles.txtBlue}>
            분석 결과가 없습니다.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const {
    balance,
    textAmount,
    sentiment,
    negativeTexts,
    positiveTexts,
    totalScore,
    startDate,
    endDate
  } = analysisResult;

  const totalTextLengthData = [{
    data: [
      {x: '우리커플', y: textAmount.userRoom},
      {x: '다른 커플 평균', y: textAmount.average},
    ],
    color: '#afc7bd'
  }];

  const textBalanceData = [{
    data: [
      {x: `${user.name}님`, y: balance.user},
      {x: `${partner.name}님`, y: balance.partner}
    ],
    color: '#ffbf74'
  }];

  const markBigSmallIcon = (leftNum, rightNum) => {
    if (leftNum > rightNum) return '>';
    if (leftNum < rightNum) return '<';
    if (leftNum = rightNum) return '=';
  };

  const insertImageByScore = (score) => {
    if (score <= 20) {
      return require('../../../assets/weather_icon05.png');
    };
    if (score <= 40) {
      return require('../../../assets/weather_icon04.png');
    };
    if (score <= 60) {
      return require('../../../assets/weather_icon03.png');
    };
    if (score <= 80) {
      return require('../../../assets/weather_icon02.png');
    };
    if (score <= 100) {
      return require('../../../assets/weather_icon01.png');
    };
  };

  const onImageSave = async () => {
    try {
      const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);

      if (status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (newPermission.status !== 'granted') {
          throw new Error('permission not granted');
        }
      }

      const uri = await scrollViewRef.current.capture();
      CameraRoll.saveToCameraRoll(uri);

      return Alert.alert(
        '성공',
        '갤러리에 저장되었습니다.',
        [{ text: '확인' }]
      );
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

  const onAnalysisDelete = async () => {
    try {
      await SecureStore.deleteItemAsync('analysisResult');
      onLoadAnalysisResult(null);

      return Alert.alert(
        '완료',
        '삭제되었습니다.',
        [{ text: '확인' }]
      );
    } catch (err) {
      console.log(err);
      return Alert.alert(
        '실패',
        '나중에 다시 시도해주세요.',
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
          결과 보고서
        </Text>
      </Header>
      <Container
        style={{
          ...styles.container,
          backgroundColor: '#f7eed3'
        }}
      >
        <Content style={{flex: 1}}>
          <ScrollView>
            <ViewShot
              ref={scrollViewRef} options={{ format: 'jpg', quality: 1 }}
              style={{ backgroundColor: '#f7eed3' }}
            >
              <View style={styles.listTitle}>
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={20}
                  style={{
                    ...commonStyles.txtBlue,
                    marginRight: 5
                  }}
                />
                <Text style={commonStyles.txtBlue}>기간</Text>
              </View>
              <ListItem last style={styles.itemHorizontal}>
                <View
                  style={{
                    ...styles.itemVertical,
                    marginTop: 10
                  }}
                >
                  <Text>
                    {moment(startDate).locale('ko').format('LL')}
                  </Text>
                  <Text style={styles.middleIcon}>
                    ~
                  </Text>
                  <Text>
                    {moment(endDate).locale('ko').format('LL')}
                  </Text>
                </View>
              </ListItem>
              <View style={styles.listTitle}>
                <SimpleLineIcons
                  name="bubbles"
                  size={20}
                  style={{
                    ...commonStyles.txtBlue,
                    marginRight: 5
                  }}
                />
                <Text style={commonStyles.txtBlue}>대화량</Text>
              </View>
              <ListItem last style={styles.itemHorizontal}>
                <Text>
                  <Text
                    style={{...styles.scoreText, color: '#afc7bd'}}
                  >
                    {parseInt(textAmount.score)}
                  </Text>
                  /{textAmount.perfectScore}점
                </Text>
                <PureChart
                  data={totalTextLengthData}
                  type="bar"
                  height={120}
                  highlightColor="#c3e2ce"
                  backgroundColor="transparent"
                />
                <View
                  style={{
                    ...styles.itemVertical,
                    marginTop: 10
                  }}
                >
                  <Text>우리 커플 대화량</Text>
                  <Text style={styles.middleIcon}>
                    {markBigSmallIcon(textAmount.userRoom, textAmount.average)}
                  </Text>
                  <Text>다른 커플 평균</Text>
                </View>
              </ListItem>
              <View style={styles.listTitle}>
                <MaterialCommunityIcons
                  name="scale-balance"
                  size={20}
                  style={{
                    ...commonStyles.txtBlue,
                    marginRight: 5
                  }}
                />
                <Text style={commonStyles.txtBlue}>대화 균형</Text>
              </View>
              <ListItem last style={styles.itemHorizontal}>
                <Text>
                  <Text
                    style={{
                      ...styles.scoreText,
                      color: '#ffbf74'
                    }}
                  >
                    {parseInt(balance.score)}
                  </Text>
                  /{balance.perfectScore}점
                </Text>
                <PureChart
                  data={textBalanceData}
                  type="bar"
                  height={120}
                  highlightColor="#ffcd93"
                  backgroundColor="transparent"
                />
                <View
                  style={{
                    ...styles.itemVertical,
                    marginTop: 10
                  }}
                >
                  <Text>{`${user.name}님`}</Text>
                  <Text style={styles.middleIcon}>
                    {markBigSmallIcon(balance.user, balance.partner)}
                  </Text>
                  <Text>{`${partner.name}님`}</Text>
                </View>
              </ListItem>
              <View style={styles.listTitle}>
                <Entypo
                  name="progress-two"
                  size={20}
                  style={{
                    ...commonStyles.txtBlue,
                    marginRight: 5
                  }}
                />
                <Text style={commonStyles.txtBlue}>대화 감정 상태</Text>
              </View>
              <ListItem last style={styles.itemHorizontal}>
                <Text>
                  <Text
                    style={{
                      ...styles.scoreText,
                      ...commonStyles.txtBlue
                    }}
                  >
                    {parseInt(sentiment.score)}
                  </Text>
                  /{sentiment.perfectScore}점
                </Text>
              </ListItem>
              <View style={styles.listTitle}>
                <MaterialCommunityIcons
                  name="emoticon-happy"
                  size={20}
                  style={{
                    ...commonStyles.txtBlue,
                    marginRight: 5
                  }}
                />
                <Text style={commonStyles.txtBlue}>
                  우리 커플이 말한 긍정적인 대화 TOP 5
                </Text>
              </View>
              <ListItem
                last
                style={{ flexWrap: 'wrap' }}
              >
                {positiveTexts.map((text, i) => (
                  <Text
                    key={i}
                    style={{
                      ...styles.tag,
                      backgroundColor: '#c3e2ce'
                    }}
                  >
                    {text.replace(/[\.]/g, ' ')}
                  </Text>
                ))}
              </ListItem>
              <View style={styles.listTitle}>
                <MaterialCommunityIcons
                  name="emoticon-sad"
                  size={20}
                  style={{
                    ...commonStyles.txtBlue,
                    marginRight: 5
                  }}
                />
                <Text style={commonStyles.txtBlue}>
                  우리 커플이 말한 부정적인 대화 TOP 5
                </Text>
              </View>
              <ListItem
                last
                style={{flexWrap: 'wrap'}}
              >
                {negativeTexts.map((text, i) => (
                  <Text
                    key={i}
                    style={{
                      backgroundColor: '#ffcd93',
                      ...styles.tag
                    }}
                  >
                    {text.replace(/[\.]/g, ' ')}
                  </Text>
                ))}
              </ListItem>
              <View style={commonStyles.textCenter}>
                <Text
                  style={{
                    ...commonStyles.txtBlue,
                    ...styles.titleBold
                  }}
                >
                  우리의 연애 점수: {totalScore.toFixed(0)}/100점
                </Text>
                <Image
                  source={insertImageByScore(parseInt(totalScore))}
                  style={styles.mainImage}
                />
              </View>
            </ViewShot>
            <View>
              <Text style={styles.infoMessage}>
                결과 보고서는 다음 분석 전까지 보관되지만 어플 삭제나 계정 전환 등의 사유로 삭제될 수 있습니다. 안전하게 보관하려면 이미지로 저장해주시기 바랍니다.
              </Text>
            </View>
          </ScrollView>
        </Content>
        <View
          style={{
            ...styles.itemVertical,
            paddingTop: 10
          }}
        >
          <Button
            rounded
            style={styles.saveBtn}
            onPress={onImageSave}
          >
            <Text>이미지로 저장하기</Text>
          </Button>
          <Button
            rounded
            style={styles.delBtn}
            onPress={onAnalysisDelete}
          >
            <AntDesign
              name="delete"
              size={20}
              color="#fff"
            />
          </Button>
        </View>
      </Container>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  },
  mainImage: {
    width: 200,
    height: 200,
    marginBottom: 30
  },
  itemHorizontal: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemVertical: {
    display: 'flex',
    flexDirection: 'row'
  },
  listTitle: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    marginTop: 10
  },
  scoreText: {
    fontSize: 50,
    fontWeight: 'bold'
  },
  tag: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    flexBasis: 'auto'
  },
  titleBold: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 20,
    marginBottom: 20
  },
  middleIcon: {
    marginLeft: 10,
    marginRight: 10
  },
  infoMessage: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999'
  },
  saveBtn: {
    flex: 4,
    marginRight: 5,
    backgroundColor: '#907af0'
  },
  delBtn: {
    flex: 1,
    backgroundColor: '#f07a7a'
  }
});
