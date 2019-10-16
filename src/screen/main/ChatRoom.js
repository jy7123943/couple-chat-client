
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Form } from 'react-native';
import { Header, Left, Right, Text, Button, Input, Item } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../../styles/Styles';
import io from 'socket.io-client';
import getEnvVars from '../../../environment';
const { apiUrl } = getEnvVars();
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    // this.socket = io(apiUrl);
    this.state = {
      text: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    const {screenProps: {
      userInfo,
      roomInfo,
      socket,
      userProfile
    }} = this.props;
    console.log(userProfile)

    socket.connect();
    socket.on('connect', () => {
      socket.emit('joinRoom', userInfo.userId, roomInfo.roomKey);
      console.log('chatroom socket connected');
    });

    socket.on('disconnect', () => {
      console.log('chatroom socket disconnected');
      socket.connect();
    });

    socket.on('connect_timeout', (timeout) => {
      console.log('chatroom socket timeout');
      socket.connect();
    });

    socket.on('sendMessage', ({ chat }) => {
      console.log('sendMessage===========================', chat);
    });
  }

  componentWillUnmount() {
    // this.socket.emit('leaveRoom');
    // this.socket.removeAllListeners();
    // this.socket.disconnect();
  }

  sendTextMessage = () => {
    const {
      screenProps: {
        socket,
        chatTextList,
        setChatTextList
      }
    } = this.props;
    // console.log('STATE/userProfile: ', this.props.screenProps);
    const { text } = this.state;
    // console.log('TEXT: ', text);

    if (!text.trim()) {
      return;
    }

    const {screenProps: {
      userInfo,
      roomInfo
    }} = this.props;

    const copiedChatList = chatTextList.slice();

    setChatTextList(copiedChatList.concat([{
      text: text.trim(),
      created_at: new Date(),
      user_id: userInfo.userId
    }]));

    socket.emit('sendMessage', {
      text: text.trim(),
      userId: userInfo.userId,
      roomKey: roomInfo.roomKey,
      time: new Date()
    });
  };

  render() {
    const {screenProps: {
      chatTextList,
    }} = this.props;
    console.log(chatTextList,'30240---------------------');
    // const { navigation } = this.props;
    return (
      <LinearGradient
        colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
        style={{
          ...commonStyles.container,
          justifyContent: 'space-between',
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
            flex: 6
          }}
          behavior="padding"
          enabled
        >
          <ScrollView>
            {chatTextList.length > 0 && (
              chatTextList.map(chat => (
                <View key={chat.created_at}>
                  <Text>{chat.text}</Text>
                  <Text>{moment(chat.created_at).format('hh:mm a')}</Text>
                </View>
              ))
            )}
          </ScrollView>
          <View style={{
            height: 70
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

// export default function ChatRoom (props) {
//   const socket = io(apiUrl);
//   const [chatText, onChangeChatText] = useState('');

//   useEffect(() => {
//     const {screenProps: {
//       userInfo,
//       roomInfo
//     }} = props;

//     socket.connect();
//     socket.on('connect', () => {
//       console.log('chatroom socket connected');
//     });

//     socket.on('disconnect', () => {
//       console.log('chatroom socket disconnected');
//       socket.connect();
//     });

//     socket.on('connect_timeout', (timeout) => {
//       console.log('chatroom socket timeout');
//       socket.connect();
//     });

//     socket.on('sendMessage', ({ chat }) => {
//       console.log('sendMessage===========================', chat);
//     });

//     socket.emit('joinRoom', userInfo.userId, roomInfo.roomKey);


//   }, []);

//   sendTextMessage = () => {
//     // console.log('STATE/userProfile: ', this.props.screenProps);
//     // console.log('TEXT: ', text);

//     if (!chatText.trim()) {
//       return;
//     }

//     const {screenProps: {
//       userInfo,
//       roomInfo
//     }} = props;

//     socket.emit('sendMessage', {
//       text: chatText.trim(),
//       userId: userInfo.userId,
//       roomKey: roomInfo.roomKey,
//       time: new Date()
//     });
//   };

//   return (
//     <LinearGradient
//       colors={['#f7dfd3', '#e2c3c8', '#afafc7']}
//       style={{
//         ...commonStyles.container,
//         justifyContent: 'space-between',
//       }}
//     >
//       <View style={{
//         ...commonStyles.headerContainer,
//         height: 70
//       }}>
//         <Header style={commonStyles.header}>
//           <Left>
//             <Button
//               transparent
//               onPress={() => {
//                 navigation.goBack();
//               }}
//             >
//               <AntDesign
//                 name="left"
//                 color="#5f7daf"
//                 size={15}
//               />
//             </Button>
//           </Left>
//           <Right
//             style={commonStyles.rightTextBtn}
//           >
//             <Text style={commonStyles.txtBlue}>
//               Join
//             </Text>
//           </Right>
//         </Header>
//       </View>
//       <KeyboardAvoidingView
//         style={{
//           flex: 6
//         }}
//         behavior="padding"
//         enabled
//       >
//         <ScrollView>
//           <Text>hello</Text>
//         </ScrollView>
//         <View style={{
//           height: 70
//         }}>
//           <Item>
//             <Input
//               onChangeText={(text) => {
//                 onChangeChatText(text);
//               }}
//               value={chatText}
//             />
//             <Button
//               transparent
//               onPress={sendTextMessage}
//             >
//               <Feather
//                 name='send'
//                 size={30}
//                 color="#5f7daf"
//               />
//             </Button>
//           </Item>
//         </View>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  }
});
