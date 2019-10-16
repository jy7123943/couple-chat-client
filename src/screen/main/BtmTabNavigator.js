import React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import Profile from './Profile';
import ChatRoom from './ChatRoom';
import ChatAnalysis from './ChatAnalysis';

const TabBarComponent = props => <BottomTabBar {...props} />;

const Tab = createBottomTabNavigator({
  Profile,
  ChatRoom: {
    screen: ChatRoom,
    navigationOptions: { tabBarVisible: false }
  },
  ChatAnalysis
},
{
  tabBarComponent: props => (
    <TabBarComponent {...props} style={{ borderTopColor: '#605F60' }} />
  ),
});

export default createAppContainer(Tab);
