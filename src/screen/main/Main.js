import React, { useState, useEffect } from 'react';
import TabNavigator from './BtmTabNavigator';

export default function Main (props) {
  const { screenProps } = props;
  const [ userProfile, setUserProfile ] = useState(null);
  const [ analysisResult, setAnalysisResult ] = useState(null);

  const onLoadUserProfile = ({ userProfile }) => {
    try {
      const {
        partner_id: partner
        // chatroom_id: chatRoom
      } = userProfile;

      // console.log(partner)
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
      console.log('partner', partner);
      // setChatTextList(chatRoom.chats);
    } catch (err) {
      console.log('timeout error',err);
    }
  };

  const onLoadAnalysisResult = (analysisResult) => {
    setAnalysisResult(analysisResult);
  };

  return (
    <TabNavigator
      screenProps={{
        ...screenProps,
        userProfile,
        onLoadUserProfile,
        analysisResult,
        onLoadAnalysisResult
      }}
    />
  );
}
