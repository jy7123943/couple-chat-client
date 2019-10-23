import React from 'react';
import Login from '../../auth/Login';

import { shallow } from 'enzyme';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'native-base';

describe('<Login />', () => {
  let wrapper;
  let navigation;
  let screenProps;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
    screenProps = {
      setUserInfo: jest.fn(),
      setRoomInfo: jest.fn(),
      api: {
        loginApi: jest.fn()
      }
    };
    wrapper = shallow(
      <Login
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
});
