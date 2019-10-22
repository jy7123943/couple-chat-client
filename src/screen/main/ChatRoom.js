
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Header, Left, Right, Text, Button, Input, Item, Thumbnail, Spinner } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../../styles/Styles';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import io from 'socket.io-client';
import moment from 'moment';
import 'moment/min/locales';
import { getChatTextsApi } from '../../../utils/api';
import { verifyDateChange } from '../../../utils/utils';
import getEnvVars from '../../../environment';
const { apiUrl } = getEnvVars();

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      chatTextList: [],
      isLoading: false,
      isError: false
    };

    this.socket = io(apiUrl, { autoConnect: false });
  }

  componentDidMount() {
    const {
      navigation,
      screenProps: {
        userInfo,
        roomInfo
      }
    } = this.props;

    this.socket.connect();

    this.focusListener = navigation.addListener('didFocus', async () => {
      console.log('screen did focus');
      try {
        this.setState({
          ...this.state,
          isLoading: true
        });

        const { chats } = await getChatTextsApi(userInfo.token);
        this.onLoadChatTextList(chats);
      } catch (err) {
        console.log(err);
      }

      this.socket.emit('joinRoom', roomInfo.roomKey);
    });

    this.blurListener = navigation.addListener('didBlur', () => {
      console.log('screen did blur');
      this.socket.emit('leaveRoom', roomInfo.roomKey);
    });

    this.socket.on('connect', () => {
      console.log('chatroom socket connected');
    });

    this.socket.on('error', (err) => {
      this.setState({
        ...this.state,
        isError: true
      });
      console.log('chatroom socket error', err);
    });

    this.socket.on('disconnect', () => {
      console.log('disconnect');
    });

    this.socket.on('sendMessage', ({ chat }) => {
      const { chatTextList } = this.state;

      const copiedChatList = chatTextList.slice();
      const newChat = [{
        text: chat.text,
        created_at: chat.time,
        user_id: chat.userId
      }];

      this.onLoadChatTextList(copiedChatList.concat(newChat));
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    this.socket.disconnect();
  }

  onLoadChatTextList = (chats) => {
    this.setState({
      ...this.state,
      chatTextList: chats,
      isLoading: false
    });
  };

  sendTextMessage = () => {
    const {
      screenProps: {
        userInfo,
        roomInfo
      }
    } = this.props;

    const { text } = this.state;

    if (!text.trim()) {
      return;
    }

    const newChat = {
      text: text.trim(),
      userId: userInfo.userId,
      roomKey: roomInfo.roomKey,
      time: new Date()
    };

    this.socket.emit('sendMessage', newChat);

    this.setState({
      ...this.state,
      text: ''
    });
  };

  scrollToBottom = () => {
    this.refs.chatViewBtm.scrollToEnd({ animated: false });
  };

  render() {
    const {
      navigation,
      screenProps: {
        userProfile,
        roomInfo: {
          partnerId
        }
      }
    } = this.props;

    const {
      chatTextList,
      isLoading
    } = this.state;

    return (
      <LinearGradient
        colors={['#f7eed3', '#c3e2ce', '#afc7bd']}
        style={{
          ...commonStyles.container,
          ...styles.container
        }}
      >
        <View style={{
          ...commonStyles.headerContainer,
          height: 70
        }}>
          <Header style={commonStyles.header}>
            <Left>
              <Button
                transparent
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <AntDesign
                  name="left"
                  color="#5f7daf"
                  size={15}
                />
              </Button>
            </Left>
            <Right
              style={commonStyles.rightTextBtn}
            >
              <Text style={commonStyles.txtBlue}>
                Join
              </Text>
            </Right>
          </Header>
        </View>
        <KeyboardAvoidingView
          style={styles.chatBoxWrap}
          behavior="padding"
          enabled
        >
          <ScrollView
            ref="chatViewBtm"
            onLayout={this.scrollToBottom}
            onContentSizeChange={this.scrollToBottom}
          >
            <>
              {chatTextList && chatTextList.length > 0 && (
                chatTextList.map((chat, i) => {
                  const isPartner = chat.user_id === partnerId;
                  const isFirstPartner = isPartner && (i === 0 || chatTextList[i - 1].user_id !== partnerId);
                  const imageUrl = userProfile.partner.profileImageUrl;

                  const isDateChanged = (i === 0) || verifyDateChange(
                    new Date(chatTextList[i - 1].created_at),
                    new Date(chat.created_at)
                  );

                  return (
                    <View key={i}>
                      {isDateChanged && (
                        <View
                          style={commonStyles.textCenter}
                        >
                          <Text
                            style={styles.dateBox}
                          >
                            {moment(chat.created_at).locale('ko').format('YYYY MMM Do dddd')}
                          </Text>
                        </View>
                      )}
                      <View
                        style={[isPartner ? {
                          ...styles.chatTextBox,
                          ...styles.textLeft
                        } : {
                          ...styles.chatTextBox,
                          ...styles.textRight
                        }]}
                      >
                        {isFirstPartner && (
                          <Thumbnail
                            source={imageUrl ? {
                              uri: userProfile.partner.profileImageUrl
                            } : require('../../../assets/profile.jpg')}
                            style={styles.imageBox}
                          />
                        )}
                        <Text>
                          {chat.text}
                        </Text>
                        <Text
                          style={[isPartner ? {
                            ...styles.timeMark,
                            ...styles.timeRight
                          } : {
                            ...styles.timeMark,
                            ...styles.timeLeft
                          }]}
                        >
                          {moment(chat.created_at).locale('ko').format('LT')}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
              {isLoading && <Spinner color="#5f7daf" />}
            </>
          </ScrollView>
          <View style={{
            height: 50,
            marginTop: 10
          }}>
            <Item style={{ borderColor: 'transparent' }}>
              <Input
                onChangeText={(text) => {
                  this.setState({
                    ...this.state,
                    text
                  });
                }}
                value={this.state.text}
                style={styles.inputText}
              />
              <Button
                transparent
                onPress={this.sendTextMessage}
                style={styles.chatBtn}
              >
                <FontAwesome
                  name="heart-o"
                  size={25}
                  color="#eee"
                />
              </Button>
            </Item>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'space-between'
  },
  chatTextBox: {
    position: 'relative',
    display: 'flex',
    alignSelf: 'flex-start',
    maxWidth: '75%',
    marginBottom: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 15,
    backgroundColor: '#fff'
  },
  chatBoxWrap: {
    flex: 6,
    padding: 4,
    paddingTop: 15,
    paddingBottom: 15,
  },
  textLeft: {
    marginLeft: 40,
    marginRight: 'auto'
  },
  textRight: {
    marginLeft: 'auto'
  },
  timeMark: {
    position: 'absolute',
    bottom: 2,
    fontSize: 10,
    color: '#98a49e'
  },
  timeLeft: {
    left: -45
  },
  timeRight: {
    right: -45
  },
  imageBox: {
    position: 'absolute',
    top: -8,
    left: -40,
    width: 35,
    height: 35
  },
  dateBox: {
    marginTop: 20,
    marginBottom: 10,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 12,
    color: '#fff',
    borderRadius: 15,
    backgroundColor: 'rgba(152, 164, 158, 0.6)'
  },
  inputText: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  chatBtn: {
    width: 50,
    height: 50,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    backgroundColor: 'rgba(95, 125, 175, 0.68)'
  }
});
