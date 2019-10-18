
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Form } from 'react-native';
import { Header, Left, Right, Text, Button, Input, Item, Thumbnail } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../../styles/Styles';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/min/locales';
import { getChatTextsApi } from '../../../utils/api';

export default function ChatRoom () {
  const [ text, setText ] = useState('');
  const [ isLoading, setLoading ] = useState(false);
  const [ chatTextList, setChatTextList ] = useState([]);
  const [ isPartnerConnected, setPartnerConnected ] = useState(false);
}

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      isLoading: false,
      chatTextList: [],
      isPartnerConnected: false
    };
  }

  componentDidMount() {
    const {
      navigation,
      screenProps: {
        userInfo,
        roomInfo,
        socket
      }
    } = this.props;

    this.focusListener = navigation.addListener("didFocus", async () => {
      console.log('componentdidmount');
      try {
        const { chats } = await getChatTextsApi(userInfo.token);
        this.onLoadChatTextList(chats);
      } catch (err) {
        console.log(err);
      }

      socket.connect();
      socket.emit('joinRoom', roomInfo.roomKey);
    });

    this.blurListener = navigation.addListener("didBlur", () => {
      console.log('unmount');
      socket.emit('leaveRoom', roomInfo.roomKey);
      socket.disconnect();
    });

    socket.on('connect', () => {
      console.log('chatroom socket connected');
    });

    socket.on('error', () => {
      console.log('chatroom socket error');
      // socket.connect();
    });

    socket.on('disconnect', () => {
      // socket.connect();
    });

    socket.on('partnerConnect', () => {
      console.log('partnerConnect');
      this.onPartnerConnectionChange(true);
    });

    socket.on('partnerDisconnect', () => {
      console.log('partnerDisconnect');
      this.onPartnerConnectionChange(false);
    });

    socket.on('sendMessage', ({ chat }) => {
      const {
        chatTextList
      } = this.state;
      console.log('sendMessage', chat);
      const copiedChatList = chatTextList.slice();

      this.onLoadChatTextList(copiedChatList.concat([{
        text: chat.text,
        created_at: chat.time,
        user_id: chat.userId
      }]));
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
  }

  onLoadChatTextList = (chats) => {
    this.setState({
      ...this.state,
      chatTextList: chats
    });
  };

  onPartnerConnectionChange = (isConnected) => {
    this.setState({
      ...this.state,
      isPartnerConnection: isConnected
    });
  };

  sendTextMessage = () => {
    const {
      screenProps: {
        socket,
        userInfo,
        roomInfo
      }
    } = this.props;

    const { text } = this.state;

    if (!text.trim()) {
      return;
    }

    socket.emit('sendMessage', {
      text: text.trim(),
      userId: userInfo.userId,
      roomKey: roomInfo.roomKey,
      time: new Date()
    });

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
      chatTextList
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
          style={{
            flex: 6,
            padding: 4,
            paddingTop: 15,
            paddingBottom: 15,
          }}
          behavior="padding"
          enabled
        >
          <ScrollView
            ref='chatViewBtm'
            onLayout={this.scrollToBottom}
            onContentSizeChange={this.scrollToBottom}
          >
            {chatTextList.length > 0 && (
              chatTextList.map((chat, i) => {
                const isPartner = chat.user_id === partnerId;
                const isFirstPartner = isPartner && (i === 0 || chatTextList[i - 1].user_id !== partnerId);
                const imageUrl = userProfile.partner.profileImageUrl;

                const verifyDateChange = (today, yesterday) => {
                  return (today.getDate() - yesterday.getDate()) !== 0
                  || today.getMonth() !== yesterday.getMonth()
                  || today.getFullYear() !== yesterday.getFullYear()
                };

                const isDateChanged = (i === 0) || verifyDateChange(
                  new Date(chatTextList[i - 1].created_at),
                  new Date(chat.created_at)
                );

                return (
                  <View key={chat.created_at}>
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
          </ScrollView>
          <View style={{
            height: 60
          }}>
            <Item>
              <Input
                onChangeText={(text) => {
                  this.setState({
                    ...this.state,
                    text
                  });
                }}
                value={this.state.text}
              />
              <Button
                transparent
                onPress={this.sendTextMessage}
              >
                <Feather
                  name='send'
                  size={30}
                  color="#5f7daf"
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
    display: 'flex',
    alignSelf: 'flex-start',
    maxWidth: '75%',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 15,
    position: 'relative',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  textLeft: {
    marginRight: 'auto',
    marginLeft: 40
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
    right: -45,
  },
  imageBox: {
    position: 'absolute',
    top: -8,
    left: -40,
    width: 35,
    height: 35
  },
  dateBox: {
    fontSize: 12,
    color: '#fff',
    borderRadius: 15,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(152, 164, 158, 0.6)'
  }
});
