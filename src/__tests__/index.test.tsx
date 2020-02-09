/*!
 * React Native Autolink
 *
 * Copyright 2016-2020 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import Autolink from '..';

describe('<Autolink />', () => {
  test('renders a Text node', () => {
    const tree = renderer.create(<Autolink text="" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders a string when nothing to link', () => {
    const tree = renderer.create(<Autolink text="Testing" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('wraps an email address with a link Text node when email prop enabled', () => {
    const tree = renderer.create(<Autolink text="josh@example.com" email />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not wrap an email address in a link Text node when email prop disabled', () => {
    const tree = renderer.create(<Autolink text="josh@example.com" email={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('wraps a hashtag in a link Text node when hashtag prop enabled', () => {
    const tree = renderer.create(<Autolink text="#awesome" hashtag="instagram" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not wrap a hashtag in a link Text node when hashtag prop disabled', () => {
    const tree = renderer.create(<Autolink text="#awesome" hashtag={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('wraps a mention/handle in a link Text node when mention prop enabled', () => {
    const tree = renderer.create(<Autolink text="@twitter" mention="twitter" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not wrap a mention/handle in a link Text node when mention prop disabled', () => {
    const tree = renderer.create(<Autolink text="@twitter" mention={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('wraps a phone number in a link Text node when phone prop enabled', () => {
    const tree = renderer.create(<Autolink text="415-555-5555" phone />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not wrap a phone number in a link Text node when phone prop disabled', () => {
    const tree = renderer.create(<Autolink text="415-555-5555" phone={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('wraps a url in a link Text node when url prop enabled', () => {
    const tree = renderer.create(<Autolink text="https://github.com/joshswan/react-native-autolink" url />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('matches top-level domain url when wwwMatches enabled', () => {
    const tree = renderer.create(<Autolink text="github.com" url={{ tldMatches: true }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not match top-level domain url when wwwMatches disabled', () => {
    const tree = renderer.create(<Autolink text="github.com" url={{ tldMatches: false }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not match www-containing url when wwwMatches disabled', () => {
    const tree = renderer.create(<Autolink text="www.github.com" url={{ wwwMatches: false }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not match scheme-containing url when schemeMatches disabled', () => {
    const tree = renderer.create(<Autolink text="http://github.com" url={{ schemeMatches: false }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not wrap a url in a link Text node when url prop disabled', () => {
    const tree = renderer.create(<Autolink text="https://github.com/joshswan/react-native-autolink" url={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('links multiple elements individually', () => {
    const tree = renderer.create((
      <Autolink
        text="Hi @josh (josh@example.com or 415-555-5555), check out https://github.com/joshswan/react-native-autolink. It's #awesome!"
        email
        hashtag="instagram"
        mention="twitter"
        phone
        url
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('removes url prefixes when stripPrefix prop enabled', () => {
    const tree = renderer.create(<Autolink text="https://github.com" stripPrefix />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not remove url prefixes when stripPrefix prop disabled', () => {
    const tree = renderer.create(<Autolink text="https://github.com" stripPrefix={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('removes url trailing slashes when stripTrailingSlash prop enabled', () => {
    const tree = renderer.create(<Autolink text="github.com/" stripTrailingSlash />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not remove url trailing slashes when stripTrailingSlash prop disabled', () => {
    const tree = renderer.create(<Autolink text="github.com/joshswan/" stripTrailingSlash={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('truncates urls to length specified in truncate prop', () => {
    const tree = renderer.create((
      <Autolink
        text="github.com/joshswan/react-native-autolink"
        truncate={32}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not truncate urls when zero is passed for truncate prop', () => {
    const tree = renderer.create((
      <Autolink
        text="github.com/joshswan/react-native-autolink"
        truncate={0}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('replaces removed protion of truncated url with truncateChars prop value', () => {
    const tree = renderer.create(<Autolink
      text="github.com/joshswan/react-native-autolink"
      truncate={32}
      truncateChars="__"
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('truncates urls at the end when specified in truncateLocation prop', () => {
    const tree = renderer.create((
      <Autolink
        stripPrefix={false}
        text="https://github.com/joshswan/react-native-autolink"
        truncate={32}
        truncateLocation="end"
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('truncates urls in the middle when specified in truncateLocation prop', () => {
    const tree = renderer.create((
      <Autolink
        stripPrefix={false}
        text="https://github.com/joshswan/react-native-autolink"
        truncate={32}
        truncateLocation="middle"
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders links using renderLink prop if provided', () => {
    const renderLink = (text, match, index) => <Text>{`${text}:${index}`}</Text>;
    const tree = renderer.create(<Autolink text="josh@example.com" renderLink={renderLink} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('calls onPress handler prop when link clicked', () => {
    const onPress = jest.fn();
    const tree = renderer.create(<Autolink text="josh@example.com" onPress={onPress} />);
    tree.root.findAllByType(Text)[1].props.onPress();
    expect(onPress.mock.calls.length).toBe(1);
    expect(onPress.mock.calls[0][0]).toBe('mailto:josh%40example.com');
  });

  test('calls onLongPress handler prop when link long pressed', () => {
    const onLongPress = jest.fn();
    const tree = renderer.create(<Autolink text="josh@example.com" onLongPress={onLongPress} />);
    tree.root.findAllByType(Text)[1].props.onLongPress();
    expect(onLongPress.mock.calls.length).toBe(1);
    expect(onLongPress.mock.calls[0][0]).toBe('mailto:josh%40example.com');
  });

  /**
   * EXPERIMENTAL
   */
  test('wraps a latitude/longitude pair in a link Text node when latlng prop enabled', () => {
    const tree = renderer.create(<Autolink text="34.0522, -118.2437" latlng />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('does not wrap a latitude/longitude pair in a link Text node when latlng prop disabled', () => {
    const tree = renderer.create(<Autolink text="34.0522, -118.2437" latlng={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
