/*!
 * React Native Autolink
 *
 * Copyright 2016-2019 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { Autolinker, AnchorTagBuilder } from 'autolinker/dist/es2015';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import * as Truncate from './truncate';
import matchers from './matchers';

const tagBuilder = new AnchorTagBuilder();

const styles = StyleSheet.create({
  link: {
    color: '#0E7AFE',
  },
});

export default class Autolink extends PureComponent {
  static truncate(text, {
    truncate = 32,
    truncateChars = '..',
    truncateLocation = 'smart',
  } = {}) {
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

  onPress(match, alertShown) {
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

  onLongPress(match) {
    const { onLongPress } = this.props;

    if (onLongPress) {
      // Get url for match
      const [url] = this.getUrl(match);

      onLongPress(url, match);
    }
  }

  getUrl(match) {
    const { hashtag, mention, phone } = this.props;
    const type = match.getType();

    switch (type) {
      case 'email': {
        return [`mailto:${encodeURIComponent(match.getEmail())}`];
      }
      case 'hashtag': {
        const tag = encodeURIComponent(match.getHashtag());

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
        const latlng = match.getLatLng();
        const query = latlng.replace(/\s/g, '');

        return [Platform.OS === 'ios' ? `http://maps.apple.com/?q=${encodeURIComponent(latlng)}&ll=${query}` : `https://www.google.com/maps/search/?api=1&query=${query}`];
      }
      case 'mention': {
        const username = match.getMention();

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
        const number = match.getNumber();

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

  renderLink(text, match, index, textProps) {
    const { truncate, linkStyle } = this.props;
    const truncated = truncate ? this.constructor.truncate(text, this.props) : text;

    return (
      <Text
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

  render() {
    // Destructure props
    /* eslint-disable no-unused-vars */
    /* https://github.com/babel/babel-eslint/issues/95 */
    let {
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
      twitter,
      url,
      webFallback,
      ...other
    } = this.props;

    // Backwards compatibility for Twitter prop
    if (!mention && twitter) {
      mention = 'twitter';
    }

    // Creates a token with a random UID that should not be guessable or
    // conflict with other parts of the string.
    const uid = Math.floor(Math.random() * 0x10000000000).toString(16);
    const tokenRegexp = new RegExp(`(@__ELEMENT-${uid}-\\d+__@)`, 'g');

    const generateToken = (() => {
      let counter = 0;
      return () => `@__ELEMENT-${uid}-${counter++}__@`; // eslint-disable-line no-plusplus
    })();

    const matches = {};

    try {
      text = Autolinker.link(text || '', {
        email,
        hashtag,
        mention,
        phone,
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
      matchers.forEach(({ id, regex, Match }) => {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.props[id]) {
          text = text.replace(regex, (...args) => {
            const token = generateToken();
            const matchedText = args[0];

            matches[token] = new Match({
              tagBuilder,
              matchedText,
              offset: args[args.length - 2],
              [id]: matchedText,
            });

            return token;
          });
        }
      });
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console

      return null;
    }

    const nodes = text
      .split(tokenRegexp)
      .filter(part => !!part)
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
      ref: (component) => { this._root = component; }, // eslint-disable-line no-underscore-dangle
      style,
      ...other,
    }, ...nodes);
  }
}

Autolink.defaultProps = {
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
  twitter: false,
  url: true,
  webFallback: Platform.OS !== 'ios', // iOS requires LSApplicationQueriesSchemes for Linking.canOpenURL
};

Autolink.propTypes = {
  email: PropTypes.bool,
  hashtag: PropTypes.oneOf([
    false,
    'facebook',
    'instagram',
    'twitter',
  ]),
  latlng: PropTypes.bool,
  linkStyle: Text.propTypes.style, // eslint-disable-line react/no-typos
  mention: PropTypes.oneOf([
    false,
    'instagram',
    'soundcloud',
    'twitter',
  ]),
  numberOfLines: PropTypes.number,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  phone: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  renderLink: PropTypes.func,
  showAlert: PropTypes.bool,
  stripPrefix: PropTypes.bool,
  stripTrailingSlash: PropTypes.bool,
  style: Text.propTypes.style, // eslint-disable-line react/no-typos
  text: PropTypes.string.isRequired,
  truncate: PropTypes.number,
  truncateChars: PropTypes.string,
  truncateLocation: PropTypes.oneOf([
    'end',
    'middle',
    'smart',
  ]),
  twitter: PropTypes.bool,
  url: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      schemeMatches: PropTypes.bool,
      wwwMatches: PropTypes.bool,
      tldMatches: PropTypes.bool,
    }),
  ]),
  webFallback: PropTypes.bool,
};
