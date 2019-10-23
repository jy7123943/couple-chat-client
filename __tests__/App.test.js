import React from 'react';
import App from '../App';

import { shallow } from 'enzyme';

describe('<App />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  })

  it('has default states', () => {
    expect(wrapper.state().isReady).toBe(false);
    expect(wrapper.state().userInfo).toBe(null);
    expect(wrapper.state().roomInfo).toBe(null);
  });
});
