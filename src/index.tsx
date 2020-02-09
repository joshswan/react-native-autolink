/*!
 * React Native Autolink
 *
 * Copyright 2016-2020 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import React, { PureComponent, createElement, ReactNode } from 'react';
import {
  Autolinker,
  AnchorTagBuilder,
  Match,
  EmailMatch,
  HashtagMatch,
  MentionMatch,
  PhoneMatch,
} from 'autolinker/dist/es2015';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  StyleProp,
  Text,
  TextStyle,
  TextProps,
} from 'react-native';
import * as Truncate from './truncate';
import { Matchers, MatcherId, LatLngMatch } from './matchers';

const tagBuilder = new AnchorTagBuilder();

const styles = StyleSheet.create({
  link: {
    color: '#0E7AFE',
  },
});

interface Props {
  email?: boolean;
  hashtag?: false | 'facebook' | 'instagram' | 'twitter';
  latlng?: boolean;
  linkStyle?: StyleProp<TextStyle>;
  mention?: false | 'instagram' | 'soundcloud' | 'twitter';
  onPress?: (url: string, match: Match) => void;
  onLongPress?: (url: string, match: Match) => void;
  phone?: boolean | 'text' | 'sms';
  renderLink?: (text: string, match: Match, index: number) => React.ReactNode;
  showAlert?: boolean;
  stripPrefix?: boolean;
  stripTrailingSlash?: boolean;
  text: string;
  truncate?: number;
  truncateChars?: string;
  truncateLocation?: 'end' | 'middle' | 'smart';
  url?: boolean | {
    schemeMatches?: boolean;
    wwwMatches?: boolean;
    tldMatches?: boolean;
  };
  webFallback?: boolean;
}

export default class Autolink extends PureComponent<TextProps & Props> {
  static truncate(text: string, {
    truncate = 32,
    truncateChars = '..',
    truncateLocation = 'smart',
  } = {}): string {
    let fn;

    switch (truncateLocation) {
      case 'end':
        fn = Truncate.end;
        break;
      case 'middle':
        fn = Truncate.middle;
        break;
      default:
        fn = Truncate.smart;
    }

    return fn(text, truncate, truncateChars);
  }

  static defaultProps = {
    email: true,
    hashtag: false,
    latlng: false,
    mention: false,
    phone: true,
    showAlert: false,
    stripPrefix: true,
    stripTrailingSlash: true,
    truncate: 32,
    truncateChars: '..',
    truncateLocation: 'smart',
    url: true,
    webFallback: Platform.OS !== 'ios', // iOS requires LSApplicationQueriesSchemes for Linking.canOpenURL
  };

  onPress(match: Match, alertShown?: boolean): void {
    const {
      onPress,
      showAlert,
      webFallback,
    } = this.props;

    // Check if alert needs to be shown
    if (showAlert && !alertShown) {
      Alert.alert(
        'Leaving App',
        'Do you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => this.onPress(match, true) },
        ],
      );

      return;
    }

    // Get url(s) for match
    const [
      url,
      fallback,
    ] = this.getUrl(match);

    // Call custom onPress handler or open link/fallback
    if (onPress) {
      onPress(url, match);
    } else if (webFallback) {
      Linking.canOpenURL(url).then((supported) => {
        Linking.openURL(!supported && fallback ? fallback : url);
      });
    } else {
      Linking.openURL(url);
    }
  }

  onLongPress(match: Match): void {
    const { onLongPress } = this.props;

    if (onLongPress) {
      // Get url for match
      const [url] = this.getUrl(match);

      onLongPress(url, match);
    }
  }

  getUrl(match: Match): string[] {
    const { hashtag, mention, phone } = this.props;
    const type = match.getType();

    switch (type) {
      case 'email': {
        return [`mailto:${encodeURIComponent((match as EmailMatch).getEmail())}`];
      }
      case 'hashtag': {
        const tag = encodeURIComponent((match as HashtagMatch).getHashtag());

        switch (hashtag) {
          case 'facebook':
            return [`fb://hashtag/${tag}`, `https://www.facebook.com/hashtag/${tag}`];
          case 'instagram':
            return [`instagram://tag?name=${tag}`, `https://www.instagram.com/explore/tags/${tag}/`];
          case 'twitter':
            return [`twitter://search?query=%23${tag}`, `https://twitter.com/hashtag/${tag}`];
          default:
            return [match.getMatchedText()];
        }
      }
      case 'latlng': {
        const latlng = (match as LatLngMatch).getLatLng();
        const query = latlng.replace(/\s/g, '');

        return [Platform.OS === 'ios' ? `http://maps.apple.com/?q=${encodeURIComponent(latlng)}&ll=${query}` : `https://www.google.com/maps/search/?api=1&query=${query}`];
      }
      case 'mention': {
        const username = (match as MentionMatch).getMention();

        switch (mention) {
          case 'instagram':
            return [`instagram://user?username=${username}`, `https://www.instagram.com/${username}/`];
          case 'soundcloud':
            return [`https://soundcloud.com/${username}`];
          case 'twitter':
            return [`twitter://user?screen_name=${username}`, `https://twitter.com/${username}`];
          default:
            return [match.getMatchedText()];
        }
      }
      case 'phone': {
        const number = (match as PhoneMatch).getNumber();

        switch (phone) {
          case 'sms':
          case 'text':
            return [`sms:${number}`];
          default:
            return [`tel:${number}`];
        }
      }
      case 'url': {
        return [match.getAnchorHref()];
      }
      default: {
        return [match.getMatchedText()];
      }
    }
  }

  renderLink(
    text: string,
    match: Match,
    index: number,
    textProps: Partial<TextProps>,
  ): ReactNode {
    const { truncate, linkStyle } = this.props;
    const truncated = truncate ? Autolink.truncate(text, this.props) : text;

    return (
      <Text
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...textProps}
        key={index}
        style={linkStyle || styles.link}
        onPress={() => this.onPress(match)}
        onLongPress={() => this.onLongPress(match)}
      >
        {truncated}
      </Text>
    );
  }

  render(): ReactNode {
    const {
      children,
      email,
      hashtag,
      latlng,
      linkStyle,
      mention,
      onPress,
      onLongPress,
      phone,
      renderLink,
      showAlert,
      stripPrefix,
      stripTrailingSlash,
      style,
      text,
      truncate,
      truncateChars,
      truncateLocation,
      url,
      webFallback,
      ...other
    } = this.props;

    // Creates a token with a random UID that should not be guessable or
    // conflict with other parts of the string.
    const uid = Math.floor(Math.random() * 0x10000000000).toString(16);
    const tokenRegexp = new RegExp(`(@__ELEMENT-${uid}-\\d+__@)`, 'g');

    const generateToken = (() => {
      let counter = 0;
      return () => `@__ELEMENT-${uid}-${counter++}__@`; // eslint-disable-line no-plusplus
    })();

    const matches: { [token: string]: Match } = {};
    let linkedText: string;

    try {
      linkedText = Autolinker.link(text || '', {
        email,
        hashtag,
        mention,
        phone: !!phone,
        urls: url,
        stripPrefix,
        stripTrailingSlash,
        replaceFn: (match) => {
          const token = generateToken();

          matches[token] = match;

          return token;
        },
      });

      // Custom matchers
      Matchers.forEach((matcher) => {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.props[matcher.id as MatcherId]) {
          linkedText = linkedText.replace(matcher.regex, (...args) => {
            const token = generateToken();
            const matchedText = args[0];

            matches[token] = new matcher.Match({
              tagBuilder,
              matchedText,
              offset: args[args.length - 2],
              [matcher.id as MatcherId]: matchedText,
            });

            return token;
          });
        }
      });
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console

      return null;
    }

    const nodes = linkedText
      .split(tokenRegexp)
      .filter((part) => !!part)
      .map((part, index) => {
        const match = matches[part];

        if (!match) return part;

        switch (match.getType()) {
          case 'email':
          case 'hashtag':
          case 'latlng':
          case 'mention':
          case 'phone':
          case 'url':
            return (renderLink)
              ? renderLink(match.getAnchorText(), match, index)
              : this.renderLink(match.getAnchorText(), match, index, other);
          default:
            return part;
        }
      });

    return createElement(Text, {
      style,
      ...other,
    }, ...nodes);
  }
}
