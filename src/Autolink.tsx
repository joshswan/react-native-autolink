/*!
 * React Native Autolink
 *
 * Copyright 2016-2023 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import React, { createElement, useCallback } from 'react';
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

export type AutolinkComponentProps<C extends React.ElementType = typeof Text> =
  PolymorphicComponentProps<C, AutolinkProps>;

// A function declaration (rather than an inline arrow function) keeps `typeof Text` in the
// emitted declarations instead of inlining the Text type from the React Native version used to build.
function AutolinkComponent<C extends React.ElementType = typeof Text>({
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
}: AutolinkComponentProps<C>): React.JSX.Element | null {
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
          {...linkProps}
          key={index}
        >
          {truncated}
        </Text>
      );
    },
    [linkProps, linkStyle, truncateProp, truncateChars, truncateLocation, onPress, onLongPress],
  );

  const input = text || '';
  let matches: Match[];

  try {
    matches = Autolinker.parse(input, {
      email,
      hashtag,
      mention,
      phone: !!phone,
      urls: url,
      stripPrefix,
      stripTrailingSlash,
    });

    // User-specified custom matchers
    matchers.forEach((matcher) => {
      // Search the original input so regexes never see replacement tokens.
      // Non-global patterns should still find the first match outside an existing link.
      const pattern =
        matcher.pattern.global || matcher.pattern.sticky
          ? matcher.pattern
          : new RegExp(matcher.pattern.source, `${matcher.pattern.flags}g`);
      const previousMatches = [...matches].sort((a, b) => a.getOffset() - b.getOffset());
      let previousIndex = 0;
      let hasMatch = false;

      input.replace(pattern, (...replacerArgs) => {
        const matchedText = replacerArgs[0];
        if (!matcher.pattern.global && hasMatch) return matchedText;

        const hasNamedGroups = typeof replacerArgs[replacerArgs.length - 1] === 'object';
        const offset = replacerArgs[replacerArgs.length - (hasNamedGroups ? 3 : 2)];
        // Regex matches arrive in order; scan previous matches only once per matcher.
        while (
          previousIndex < previousMatches.length &&
          previousMatches[previousIndex].getOffset() !== offset &&
          previousMatches[previousIndex].getOffset() +
            previousMatches[previousIndex].getMatchedText().length <=
            offset
        ) {
          previousIndex += 1;
        }
        const previous = previousMatches[previousIndex];
        const overlaps =
          previous &&
          (offset === previous.getOffset() ||
            (offset < previous.getOffset() + previous.getMatchedText().length &&
              offset + matchedText.length > previous.getOffset()));

        if (overlaps) return matchedText;

        matches.push(new CustomMatch({ matcher, matchedText, offset, replacerArgs, tagBuilder }));
        hasMatch = true;

        return matchedText;
      });
    });
  } catch (e) {
    console.warn('RN Autolink error:', e);
    return null;
  }

  const parts: (string | Match)[] = [];
  let lastIndex = 0;
  matches
    .sort((a, b) => a.getOffset() - b.getOffset())
    .forEach((match) => {
      const offset = match.getOffset();
      if (offset > lastIndex) parts.push(input.slice(lastIndex, offset));
      parts.push(match);
      lastIndex = offset + match.getMatchedText().length;
    });
  if (lastIndex < input.length) parts.push(input.slice(lastIndex));

  const nodes = parts.map((part, index) => {
    // Check if rendering link or text node
    if (typeof part !== 'string') {
      if (part instanceof CustomMatch) {
        const customRender = part.getRenderFn();
        if (customRender) return customRender(part.getAnchorText(), part, index);
      }
      return (renderLinkProp || renderLink)(part.getAnchorText(), part, index);
    }

    return renderText ? (
      renderText(part, index)
    ) : (
      <Text {...textProps} key={index}>
        {part}
      </Text>
    );
  });

  return createElement(as || component || Text, props, ...nodes);
}

export const Autolink = React.memo(AutolinkComponent);
