/*!
 * React Native Autolink
 *
 * Copyright 2016 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */
'use strict';

import React, {Component, PropTypes, createElement} from 'react';
import Autolinker from 'autolinker';
import {Linking, Platform, StyleSheet, Text} from 'react-native';

export default class Autolink extends Component {
  getURL(match) {
    let type = match.getType();

    switch (type) {
      case 'email':
        return `mailto:${encodeURIComponent(match.getEmail())}`;
      case 'hashtag':
        const tag = encodeURIComponent(match.getHashtag());

        switch (this.props.hashtag) {
          case 'instagram':
            return this.selectURL(`instagram://tag?name=${tag}`, `https://www.instagram.com/explore/tags/${tag}/`);
          case 'twitter':
            return this.selectURL(`twitter://search?query=%23${tag}`, `https://twitter.com/hashtag/${tag}`);
          default:
            return match.getMatchedText();
        }
      case 'mention':
        const mention = match.getMention();

        switch (this.props.mention) {
          case 'instagram':
            return this.selectURL(`instagram://user?username=${mention}`, `https://www.instagram.com/${mention}/`);
          case 'twitter':
            return this.selectURL(`twitter://user?screen_name=${mention}`, `https://twitter.com/${mention}`);
          default:
            return match.getMatchedText();
        }
      case 'phone':
        return `tel:${match.getNumber()}`;
      case 'url':
        return match.getAnchorHref();
      default:
        return match.getMatchedText();
    }
  }

  selectURL(url, fallback) {
    if (this.props.webFallback) {
      return Linking.canOpenURL(url) ? url : fallback;
    }

    return url;
  }

  _onPress(url, match) {
    if (this.props.onPress) {
      this.props.onPress(url, match);
    } else {
      Linking.openURL(url);
    }
  }

  renderLink(text, url, match, index) {
    let truncated = (this.props.truncate > 0) ? Autolinker.truncate.TruncateSmart(text, this.props.truncate, this.props.truncateChars) : text;

    return (
      <Text
        key={index}
        style={[styles.link, this.props.linkStyle]}
        onPress={this._onPress.bind(this, url, match)}>
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
      linkStyle,
      mention,
      onPress,
      phone,
      renderLink,
      stripPrefix,
      text,
      truncate,
      truncateChars,
      twitter,
      url,
      webFallback,
      ...other,
    } = this.props;

    // Backwards compatibility for Twitter prop
    if (!mention && twitter) {
      mention = 'twitter';
    }

    // Creates a token with a random UID that should not be guessable or
    // conflict with other parts of the string.
    let uid = Math.floor(Math.random() * 0x10000000000).toString(16);
    let tokenRegexp = new RegExp(`(@__ELEMENT-${uid}-\\d+__@)`, 'g');

    let generateToken = (() => {
      let counter = 0;
      return () => `@__ELEMENT-${uid}-${counter++}__@`;
    })();

    let matches = {};

    try {
      text = Autolinker.link(text || '', {
        email,
        hashtag,
        mention,
        phone,
        urls: url,
        stripPrefix,
        replaceFn: (match) => {
          let token = generateToken();

          matches[token] = match;

          return token;
        },
      });
    } catch (e) {
      console.warn(e);

      return null;
    }

    let nodes = text
      .split(tokenRegexp)
      .filter((part) => !!part)
      .map((part, index) => {
        let match = matches[part];

        if (!match) return part;

        switch (match.getType()) {
          case 'email':
          case 'hashtag':
          case 'mention':
          case 'phone':
          case 'url':
            return (renderLink) ? renderLink(match.getAnchorText(), this.getURL(match), match, index) : this.renderLink(match.getAnchorText(), this.getURL(match), match, index);
          default:
            return part;
        }
      });

    return createElement(Text, {ref: (component) => { this._root = component; }, ...other}, ...nodes);
  }
}

const styles = StyleSheet.create({
  link: {
    color: '#0E7AFE',
  },
});

Autolink.defaultProps = {
  email: true,
  hashtag: false,
  mention: false,
  phone: true,
  stripPrefix: true,
  truncate: 32,
  truncateChars: '..',
  twitter: false,
  url: true,
  webFallback: Platform.OS !== 'ios', // iOS requires LSApplicationQueriesSchemes for Linking.canOpenURL
};

Autolink.propTypes = {
  email: PropTypes.bool,
  hashtag: PropTypes.oneOf([false, 'instagram', 'twitter']),
  linkStyle: Text.propTypes.style,
  mention: PropTypes.oneOf([false, 'instagram', 'twitter']),
  numberOfLines: PropTypes.number,
  onPress: PropTypes.func,
  phone: PropTypes.bool,
  renderLink: PropTypes.func,
  stripPrefix: PropTypes.bool,
  text: PropTypes.string.isRequired,
  truncate: PropTypes.number,
  truncateChars: PropTypes.string,
  twitter: PropTypes.bool,
  url: PropTypes.bool,
  webFallback: PropTypes.bool,
};
