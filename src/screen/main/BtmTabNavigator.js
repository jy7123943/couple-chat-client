import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import Profile from './Profile';
import ChatRoom from './ChatRoom';
import ChatAnalysis from './ChatAnalysis';
import ChatAnalysisResult from './ChartAnalysisResult';
import { StyleSheet, Image } from 'react-native';

const TabBarComponent = props => <BottomTabBar {...props} />;

const Tab = createBottomTabNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Image
          source={!focused ?
            require('../../../assets/love_icon04.png') :
            require('../../../assets/love_icon04_on.png')
          }
          style={styles.tabIcon}
        />
      )
    }
  },
  ChatRoom: {
    screen: ChatRoom,
    navigationOptions: {
      tabBarVisible: false,
      tabBarIcon: () => (
        <Image
          source={require('../../../assets/love_icon01.png')}
          style={styles.tabIcon}
        />
      )
    }
  },
  ChatAnalysis: {
    screen: ChatAnalysis,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Image
          source={!focused ?
            require('../../../assets/love_icon03.png') :
            require('../../../assets/love_icon03_on.png')
          }
          style={styles.tabIcon}
        />
      )
    }
  },
  ChatAnalysisResult: {
    screen: ChatAnalysisResult,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Image
          source={!focused ?
            require('../../../assets/love_icon02.png') :
            require('../../../assets/love_icon02_on.png')
          }
          style={styles.tabIcon}
        />
      )
    }
  }
},
{
  tabBarOptions: {
    showLabel: false
  },
  tabBarComponent: props => {
    return (
      <TabBarComponent
        {...props}
        style={{
          height: 60,
          borderTopColor: '#40406a',
          backgroundColor: '#40406a'
        }}
      />
    );
  }
});

const styles = StyleSheet.create({
  tabIcon: {
    width: 35,
    height: 35,
  }
});

export default createAppContainer(Tab);

