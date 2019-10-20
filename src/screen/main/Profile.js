import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import { Container, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../../styles/Styles';
import { getUserInfoApi } from '../../../utils/api';
import { calculateDday } from '../../../utils/utils';
import { Notifications } from 'expo';
import ProfileModal from '../../components/main/ProfileModal';
import { FontAwesome } from '@expo/vector-icons';
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
  console.log('STATE/userProfile: ', userProfile);

  useEffect(() => {
    const onLoad = async () => {
      try {
        const user = await getUserInfoApi(userInfo.token);
        onLoadUserProfile(user);
        setLoading(false);
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
          <Image
            source={partner.profileImageUrl ?
              { uri: partner.profileImageUrl } :
              require('../../../assets/profile.jpg')
            }
            style={styles.imageBox}
          />
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
          <Image
            source={user.profileImageUrl ?
              { uri: user.profileImageUrl } :
              require('../../../assets/profile.jpg')
            }
            style={styles.imageBox}
          />
        </TouchableHighlight>
      </Container>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    borderRadius: 10
  },
  imageBox: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    marginBottom: 20
  },
  ddayBox: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
