/*!
 * React Native Autolink
 *
 * Copyright 2016-2018 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import React from 'react';
import { Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Autolink from '../src/index';

describe('<Autolink />', () => {
  it('should render a Text node', () => {
    const wrapper = shallow(<Autolink text="" />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should render a string when nothing to link', () => {
    const wrapper = shallow(<Autolink text="Testing" />);
    expect(wrapper.children().equals('Testing')).to.equal(true);
  });

  it('should wrap an email address in a Text node when email prop enabled', () => {
    const wrapper = shallow(<Autolink text="josh@example.com" email />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should not wrap an email address in a Text node when email prop disabled', () => {
    const wrapper = shallow(<Autolink text="josh@example.com" email={false} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should wrap a hashtag in a Text node when hashtag prop enabled', () => {
    const wrapper = shallow(<Autolink text="#awesome" hashtag="instagram" />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should not wrap a hashtag in a Text node when hashtag prop disabled', () => {
    const wrapper = shallow(<Autolink text="#awesome" hashtag={false} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should wrap a mention/handle in a Text node when mention prop enabled', () => {
    const wrapper = shallow(<Autolink text="@twitter" mention="twitter" />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should wrap a mention/handle in a Text node when twitter prop enabled (backwards compatibility)', () => {
    const wrapper = shallow(<Autolink text="@twitter" twitter />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should not wrap a mention/handle in a Text node when mention prop disabled', () => {
    const wrapper = shallow(<Autolink text="@twitter" mention={false} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should wrap a phone number in a Text node when phone prop enabled', () => {
    const wrapper = shallow(<Autolink text="415-555-5555" phone />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should not wrap a phone number in a Text node when phone prop disabled', () => {
    const wrapper = shallow(<Autolink text="415-555-5555" phone={false} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should wrap a url in a Text node when url prop enabled', () => {
    const wrapper = shallow(<Autolink text="https://github.com/joshswan/react-native-autolink" url />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should match top-level domain url when wwwMatches enabled', () => {
    const wrapper = shallow(<Autolink text="github.com" url={{ tldMatches: true }} />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should not match top-level domain url when wwwMatches disabled', () => {
    const wrapper = shallow(<Autolink text="github.com" url={{ tldMatches: false }} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should not match www containing url when wwwMatches disabled', () => {
    const wrapper = shallow(<Autolink text="www.github.com" url={{ wwwMatches: false }} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should not match scheme containing url when schemeMatches disabled', () => {
    const wrapper = shallow(<Autolink text="http://github.com" url={{ schemeMatches: false }} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should not wrap a url in a Text node when url prop disabled', () => {
    const wrapper = shallow(<Autolink text="https://github.com/joshswan/react-native-autolink" url={false} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should link multiple elements individually', () => {
    const wrapper = shallow((
      <Autolink
        text="Hi @josh (josh@example.com or 415-555-5555), check out https://github.com/joshswan/react-native-autolink. It's #awesome!"
        email
        hashtag="instagram"
        mention="twitter"
        phone
        url
      />
    ));
    expect(wrapper.find('Text')).to.have.length(6);
  });

  it('should remove url prefixes when stripPrefix prop enabled', () => {
    const wrapper = shallow(<Autolink text="https://github.com" stripPrefix />);
    expect(wrapper.contains('https://github.com')).to.equal(false);
    expect(wrapper.contains('github.com')).to.equal(true);
  });

  it('should not remove url prefixes when stripPrefix prop disabled', () => {
    const wrapper = shallow(<Autolink text="https://github.com" stripPrefix={false} />);
    expect(wrapper.contains('https://github.com')).to.equal(true);
  });

  it('should truncate urls to length specified in truncate prop', () => {
    const wrapper = shallow((
      <Autolink
        text="github.com/joshswan/react-native-autolink"
        truncate={32}
      />
    ));
    expect(wrapper.contains('github.com/joshswan/react-native-autolink')).to.equal(false);
    expect(wrapper.contains('github.com/joshswan/..e-autolink')).to.equal(true);
  });

  it('should not truncate urls when zero is passed for truncate prop', () => {
    const wrapper = shallow((
      <Autolink
        text="github.com/joshswan/react-native-autolink"
        truncate={0}
      />
    ));
    expect(wrapper.contains('github.com/joshswan/react-native-autolink')).to.equal(true);
    expect(wrapper.contains('github.com/joshswan/..e-autolink')).to.equal(false);
  });

  it('should replace removed protion of truncated url with truncateChars prop value', () => {
    const wrapper = shallow(<Autolink
      text="github.com/joshswan/react-native-autolink"
      truncate={32}
      truncateChars="__"
    />);
    expect(wrapper.contains('github.com/joshswan/__e-autolink')).to.equal(true);
  });

  it('should use function to render links if passed using renderLink prop', () => {
    const renderLink = (text, match, index) => <Text>{`${text}:${index}`}</Text>;
    const wrapper = shallow(<Autolink text="josh@example.com" renderLink={renderLink} />);
    expect(wrapper.contains(<Text>josh@example.com:0</Text>)).to.equal(true);
  });

  it('should call press handler when link clicked', () => {
    const onPress = sinon.spy();
    const wrapper = shallow(<Autolink text="josh@example.com" onPress={onPress} />);
    wrapper.children().find('Text').simulate('press');
    expect(onPress.called).to.equal(true);
  });

  it('should call press handler with appropriate Linking url', () => {
    const onPress = sinon.spy();
    const wrapper = shallow(<Autolink text="josh@example.com" onPress={onPress} />);
    wrapper.children().find('Text').simulate('press');
    expect(onPress.calledWith('mailto:josh%40example.com')).to.equal(true);
  });

  it('should call long press handler when link long pressed', () => {
    const onLongPress = sinon.spy();
    const wrapper = shallow(<Autolink text="josh@example.com" onLongPress={onLongPress} />);
    wrapper.children().find('Text').simulate('longPress');
    expect(onLongPress.called).to.equal(true);
  });

  /**
   * EXPERIMENTAL
   */
  it('should wrap a latitude/longitude pair in a Text node when latlng prop enabled', () => {
    const wrapper = shallow(<Autolink text="34.0522, -118.2437" latlng />);
    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should not wrap a latitude/longitude pair in a Text node when latlng prop disabled', () => {
    const wrapper = shallow(<Autolink text="34.0522, -118.2437" latlng={false} />);
    expect(wrapper.find('Text')).to.have.length(1);
  });
});
