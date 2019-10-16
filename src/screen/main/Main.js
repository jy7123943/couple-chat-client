import React, { useState, useEffect } from 'react';
import TabNavigator from './BtmTabNavigator';

export default function Main (props) {
  const { screenProps } = props;
  const [ userProfile, setUserProfile ] = useState(null);
  const [ chatTextList, setChatTextList ] = useState([]);

  const onLoadUserProfile = ({ userProfile }) => {
    const { 
      partner_id: partner,
      chatroom_id: chatRoomId,
    } = userProfile;
    setUserProfile({
      user: {
        name: userProfile.name,
        birthday: userProfile.birthday,
        firstMeetDay: userProfile.first_meet_day,
        phoneNumber: userProfile.phone_number,
        profileImageUrl: userProfile.profile_image_url
      },
      partner: {
        id: partner.id,
        birthday: partner.birthday,
        name: partner.name,
        phoneNumber: partner.phone_number,
        profileImageUrl: partner.profile_image_url
      }
    });
    setChatTextList(chatRoomId.chats);
  };

  return (
    <TabNavigator
      screenProps={{
        ...screenProps,
        onLoadUserProfile,
        userProfile,
        chatTextList,
        setChatTextList
      }}
    />
  );
}
