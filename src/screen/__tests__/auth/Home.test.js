import React from 'react';
import Home from '../../auth/Home';

import { shallow } from 'enzyme';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'native-base';

describe('<Home />', () => {
  let wrapper;
  let navigation;
  let screenProps;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
    screenProps = {
      setUserInfo: jest.fn(),
      setRoomInfo: jest.fn()
    };
    wrapper = shallow(
      <Home
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

  it('navigate to SignUp if user press sign up button', () => {
    wrapper.find(Button).first().simulate('press');
    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('navigate to Login if user press login button', () => {
    wrapper.find(Button).last().simulate('press');
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
