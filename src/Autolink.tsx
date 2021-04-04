/*!
 * React Native Autolink
 *
 * Copyright 2016-2021 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import React, { createElement, useCallback, useRef } from 'react';
import {
  Autolinker,
  AnchorTagBuilder,
  Match,
  EmailMatch,
  HashtagMatch,
  MentionMatch,
  PhoneMatch,
} from 'autolinker/dist/es2015';
import { Alert, Linking, StyleSheet, StyleProp, Text, TextStyle, TextProps } from 'react-native';
import { truncate } from './truncate';
import { CustomMatch, CustomMatcher } from './CustomMatch';
import { PolymorphicComponentProps } from './types';
import * as urls from './urls';

const makeTokenGenerator = (uid: string): [() => string, RegExp] => {
  let counter = 0;
  return [
    // eslint-disable-next-line no-plusplus
    () => `@__ELEMENT-${uid}-${counter++}__@`,
    new RegExp(`(@__ELEMENT-${uid}-\\d+__@)`, 'g'),
  ];
};

const styles = StyleSheet.create({
  link: {
    color: '#0E7AFE',
  },
});

const tagBuilder = new AnchorTagBuilder();

export interface AutolinkProps {
  email?: boolean;
  hashtag?: false | 'facebook' | 'instagram' | 'twitter';
  linkProps?: TextProps;
  linkStyle?: StyleProp<TextStyle>;
  matchers?: CustomMatcher[];
  mention?: false | 'instagram' | 'soundcloud' | 'twitter';
  onPress?: (url: string, match: Match) => void;
  onLongPress?: (url: string, match: Match) => void;
  phone?: boolean | 'text' | 'sms';
  renderLink?: (text: string, match: Match, index: number) => React.ReactNode;
  renderText?: (text: string, index: number) => React.ReactNode;
  showAlert?: boolean;
  stripPrefix?: boolean;
  stripTrailingSlash?: boolean;
  text: string;
  textProps?: TextProps;
  truncate?: number;
  truncateChars?: string;
  truncateLocation?: 'end' | 'middle' | 'smart';
  url?:
    | boolean
    | {
        schemeMatches?: boolean;
        wwwMatches?: boolean;
        tldMatches?: boolean;
      };
  useNativeSchemes?: boolean;
}

type AutolinkComponentProps<C extends React.ElementType = typeof Text> = PolymorphicComponentProps<
  C,
  AutolinkProps
>;

export const Autolink = React.memo(
  <C extends React.ElementType = typeof Text>({
    as,
    component,
    email = true,
    hashtag = false,
    linkProps = {},
    linkStyle,
    matchers = [],
    mention = false,
    onPress: onPressProp,
    onLongPress: onLongPressProp,
    phone = false,
    renderLink: renderLinkProp,
    renderText,
    showAlert = false,
    stripPrefix = true,
    stripTrailingSlash = true,
    text,
    textProps = {},
    truncate: truncateProp = 0,
    truncateChars = '..',
    truncateLocation = 'smart',
    url = true,
    useNativeSchemes = false,
    ...props
  }: AutolinkComponentProps<C>): JSX.Element | null => {
    const getUrl = useCallback(
      (match: Match): string => {
        switch (match.getType()) {
          case 'email':
            return urls.getEmailUrl(match as EmailMatch);
          case 'hashtag':
            return urls.getHashtagUrl(match as HashtagMatch, hashtag, useNativeSchemes);
          case 'mention':
            return urls.getMentionUrl(match as MentionMatch, mention, useNativeSchemes);
          case 'phone':
            return urls.getPhoneUrl(match as PhoneMatch, phone);
          default:
            return match.getAnchorHref();
        }
      },
      [hashtag, mention, phone, useNativeSchemes],
    );

    const onPress = useCallback(
      (match: Match, alertShown?: boolean): void => {
        // Bypass default press handling if matcher has custom onPress
        if (match instanceof CustomMatch && match.getMatcher().onPress) {
          match.getMatcher().onPress?.(match);
          return;
        }

        // Check if alert needs to be shown
        if (showAlert && !alertShown) {
          Alert.alert('Leaving App', 'Do you want to continue?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => onPress(match, true) },
          ]);
          return;
        }

        const linkUrl = getUrl(match);

        if (onPressProp) {
          onPressProp(linkUrl, match);
        } else {
          Linking.openURL(linkUrl);
        }
      },
      [getUrl, onPressProp, showAlert],
    );

    const onLongPress = useCallback(
      (match: Match): void => {
        // Bypass default press handling if matcher has custom onLongPress
        if (match instanceof CustomMatch && match.getMatcher().onLongPress) {
          match.getMatcher().onLongPress?.(match);
          return;
        }

        if (onLongPressProp) {
          const linkUrl = getUrl(match);
          onLongPressProp(linkUrl, match);
        }
      },
      [getUrl, onLongPressProp],
    );

    const renderLink = useCallback(
      (linkText: string, match: Match | CustomMatch, index: number) => {
        const truncated = truncateProp
          ? truncate(linkText, truncateProp, truncateChars, truncateLocation)
          : linkText;

        return (
          <Text
            style={
              (match instanceof CustomMatch && match.getMatcher().style) || linkStyle || styles.link
            }
            onPress={() => onPress(match)}
            onLongPress={() => onLongPress(match)}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...linkProps}
            key={index}
          >
            {truncated}
          </Text>
        );
      },
      [linkProps, linkStyle, truncateProp, truncateChars, truncateLocation, onPress, onLongPress],
    );

    // Creates a token with a random UID that should not be guessable or
    // conflict with other parts of the string.
    const uid = useRef(Math.floor(Math.random() * 0x10000000000).toString(16));
    const [generateToken, tokenRegexp] = makeTokenGenerator(uid.current);

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

      // User-specified custom matchers
      matchers.forEach((matcher) => {
        linkedText = linkedText.replace(matcher.pattern, (...replacerArgs) => {
          const token = generateToken();
          const matchedText = replacerArgs[0];

          matches[token] = new CustomMatch({
            matcher,
            matchedText,
            offset: replacerArgs[replacerArgs.length - 2],
            replacerArgs,
            tagBuilder,
          });

          return token;
        });
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('RN Autolink error:', e);
      return null;
    }

    const nodes = linkedText
      .split(tokenRegexp)
      .filter((part) => !!part)
      .map((part, index) => {
        const match = matches[part];

        // Check if rendering link or text node
        if (match?.getType()) {
          return (renderLinkProp || renderLink)(match.getAnchorText(), match, index);
        }

        return renderText ? (
          renderText(part, index)
        ) : (
          // eslint-disable-next-line react/jsx-props-no-spreading, react/no-array-index-key
          <Text {...textProps} key={index}>
            {part}
          </Text>
        );
      });

    return createElement(as || component || Text, props, ...nodes);
  },
);
