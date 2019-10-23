
import React from 'react';
import SignUp from '../../auth/SignUp';

import { shallow } from 'enzyme';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'native-base';

describe('<SignUp />', () => {
  let wrapper;
  let navigation;
  let screenProps;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
    screenProps = {
      setUserInfo: jest.fn(),
      setRoomInfo: jest.fn(),
      api: {
        signUpApi: jest.fn()
      }
    };
    wrapper = shallow(
      <SignUp
        navigation={navigation}
        screenProps={screenProps}
      />
    );
  });

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly', () => {
    expect(wrapper.find(LinearGradient)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(2);
  });

  it('navigates to Login component if user press login button', () => {
    wrapper.find(Button).first().simulate('press');
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
