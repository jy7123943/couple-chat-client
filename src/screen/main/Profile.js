import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableHighlight, Alert } from 'react-native';
import { Notifications } from 'expo';
import { Container, Text, Button } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { commonStyles } from '../../styles/Styles';
import { getUserInfoApi } from '../../../utils/api';
import { calculateDday } from '../../../utils/utils';
import ProfileModal from '../../components/main/ProfileModal';
import Loading from '../../components/main/Loading';

export default function Profile (props) {
  const {
    navigation,
    screenProps: {
      onLoadUserProfile,
      userProfile,
      userInfo
    }
  } = props;

  const [ isLoading, setLoading ] = useState(true);
  const [ isUserModalVisible, setUserModalVisible ] = useState(false);
  const [ isPartnerModalVisible, setPartnerModalVisible ] = useState(false);

  useEffect(() => {
    const onLoad = async () => {
      try {
        const user = await getUserInfoApi(userInfo.token);

        onLoadUserProfile(user);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        Alert.alert(
          '실패',
          '프로필 내용을 불러오는데 실패했습니다.',
          [{ text: '확인' }]
        );
      }
    };

    onLoad();

    const notificationSubscription = Notifications.addListener((notification) => {
      if (notification.origin === 'received') {
        navigation.navigate('ChatRoom');
      }
    });

    return () => notificationSubscription.remove();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const {
    user,
    partner
  } = userProfile;

  return (
    <LinearGradient
      colors={['#f7eed3', '#cbcbf8', '#afafc7']}
      style={commonStyles.container}
    >
      {isUserModalVisible ? (
        <ProfileModal
          {...props.screenProps}
          onModalClose={setUserModalVisible}
          isModalVisible={isUserModalVisible}
          userProfile={userProfile}
          isUser={true}
        />
      ) : (
        <ProfileModal
          {...props.screenProps}
          onModalClose={setPartnerModalVisible}
          isModalVisible={isPartnerModalVisible}
          userProfile={userProfile}
          isUser={false}
        />
      )}
      <Container
        style={{
          ...commonStyles.headerContainer,
          marginTop: 20
        }}
      >
        <TouchableHighlight
          style={styles.container}
          onPress={() => setPartnerModalVisible(true)}
        >
          <>
            {!!partner.personalMessage && (
              <Text style={styles.personalMessage}>
                {partner.personalMessage}
              </Text>
            )}
            <Image
              source={partner.profileImageUrl ?
                { uri: partner.profileImageUrl } :
                require('../../../assets/profile.jpg')
              }
              style={styles.imageBox}
            />
          </>
        </TouchableHighlight>
        <View style={styles.ddayBox}>
          <Text style={commonStyles.txtBlue}>
            {`${calculateDday(new Date(user.firstMeetDay))}일째 사랑중`}
          </Text>
          <FontAwesome
            name="heart-o"
            color="#5f7daf"
            style={{ marginLeft: 5 }}
          />
        </View>
        <TouchableHighlight
          style={styles.container}
          onPress={() => setUserModalVisible(true)}
        >
          <>
            {!!user.personalMessage && (
              <Text style={styles.personalMessage}>
                {user.personalMessage}
              </Text>
            )}
            <Image
              source={user.profileImageUrl ?
                { uri: user.profileImageUrl } :
                require('../../../assets/profile.jpg')
              }
              style={styles.imageBox}
            />
          </>
        </TouchableHighlight>
      </Container>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    position: 'relative',
    borderRadius: 10
  },
  imageBox: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
    borderRadius: 10
  },
  ddayBox: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  personalMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    zIndex: 5
  }
});
