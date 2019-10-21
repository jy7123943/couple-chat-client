import React, { useState } from 'react';
import TabNavigator from './BtmTabNavigator';

export default function Main (props) {
  const { screenProps } = props;
  const [ userProfile, setUserProfile ] = useState(null);
  const [ analysisResult, setAnalysisResult ] = useState(null);

  const onUserProfileUpdate = (user, partner) => {
    setUserProfile({ user, partner });
  };

  const onLoadUserProfile = ({ userProfile }) => {
    try {
      const { partner_id: partner } = userProfile;

      setUserProfile({
        user: {
          name: userProfile.name,
          birthday: userProfile.birthday,
          firstMeetDay: userProfile.first_meet_day,
          phoneNumber: userProfile.phone_number,
          profileImageUrl: userProfile.profile_image_url,
          personalMessage: userProfile.personal_message
        },
        partner: {
          id: partner.id,
          birthday: partner.birthday,
          name: partner.name,
          phoneNumber: partner.phone_number,
          profileImageUrl: partner.profile_image_url,
          personalMessage: partner.personal_message
        }
      });
    } catch (err) {
      console.log(err);
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
        analysisResult,
        onLoadUserProfile,
        onLoadAnalysisResult,
        onUserProfileUpdate
      }}
    />
  );
}
