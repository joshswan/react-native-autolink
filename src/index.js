/*!
 * React Native Autolink
 *
 * Copyright 2016-2019 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import Autolinker from 'autolinker';
import { Alert, Linking, Platform, StyleSheet, Text } from 'react-native';
import matchers from './matchers';

const tagBuilder = Autolinker.prototype.getTagBuilder();

const styles = StyleSheet.create({
  link: {
    color: '#0E7AFE',
  },
});

export default class Autolink extends Component {
  static truncate(text, {
    truncate = 32,
    truncateChars = '..',
    truncateLocation = 'smart',
  } = {}) {
    let fn;

    switch (truncateLocation) {
      case 'end':
        fn = Autolinker.truncate.TruncateEnd;
        break;
      case 'middle':
        fn = Autolinker.truncate.TruncateMiddle;
        break;
      default:
        fn = Autolinker.truncate.TruncateSmart;
    }

    return fn(text, truncate, truncateChars);
  }

  onPress(match, alertShown) {
    // Check if alert needs to be shown
    if (this.props.showAlert && !alertShown) {
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
    if (this.props.onPress) {
      this.props.onPress(url, match);
    } else if (this.props.webFallback) {
      Linking.canOpenURL(url).then((supported) => {
        Linking.openURL(!supported && fallback ? fallback : url);
      });
    } else {
      Linking.openURL(url);
    }
  }

  onLongPress(match) {
    // Get url for match
    const [
      url,
    ] = this.getUrl(match);

    if (this.props.onLongPress) {
      this.props.onLongPress(url, match);
    }
  }

  getUrl(match) {
    const type = match.getType();

    switch (type) {
      case 'email': {
        return [`mailto:${encodeURIComponent(match.getEmail())}`];
      }
      case 'hashtag': {
        const tag = encodeURIComponent(match.getHashtag());

        switch (this.props.hashtag) {
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
        const mention = match.getMention();

        switch (this.props.mention) {
          case 'instagram':
            return [`instagram://user?username=${mention}`, `https://www.instagram.com/${mention}/`];
          case 'twitter':
            return [`twitter://user?screen_name=${mention}`, `https://twitter.com/${mention}`];
          default:
            return [match.getMatchedText()];
        }
      }
      case 'phone': {
        const number = match.getNumber();

        switch (this.props.phone) {
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
    const truncated = this.props.truncate ? this.constructor.truncate(text, this.props) : text;

    return (
      <Text
        {...textProps}
        key={index}
        style={[styles.link, this.props.linkStyle]}
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
        replaceFn: (match) => {
          const token = generateToken();

          matches[token] = match;

          return token;
        },
      });

      // Custom matchers
      matchers.forEach(({ id, regex, Match }) => {
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
            return (renderLink) ?
              renderLink(match.getAnchorText(), match, index) :
              this.renderLink(match.getAnchorText(), match, index, other);
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
  truncate: 32,
  truncateChars: '..',
  truncateLocation: 'smart',
  twitter: false,
  url: true,
  webFallback: Platform.OS !== 'ios', // iOS requires LSApplicationQueriesSchemes for Linking.canOpenURL
};

Autolink.propTypes = {
  email: PropTypes.bool,
  hashtag: PropTypes.oneOf([false, 'instagram', 'twitter']),
  latlng: PropTypes.bool,
  linkStyle: Text.propTypes.style, // eslint-disable-line react/no-typos
  mention: PropTypes.oneOf([false, 'instagram', 'twitter']),
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
