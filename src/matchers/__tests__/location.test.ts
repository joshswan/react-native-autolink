/*!
 * React Native Autolink
 *
 * Copyright 2016-2023 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import { Platform } from 'react-native';
import { LatLngMatcher } from '..';

describe('Location matchers', () => {
  let OS: string;

  beforeEach(() => {
    ({ OS } = Platform);
  });

  afterEach(() => {
    Platform.OS = OS as any;
  });

  describe('LatLngMatcher', () => {
    const text = 'Location is 34.0522, -118.2437.';

    test('matches latitude/longitude pair in text', () => {
      expect(text.replace(LatLngMatcher.pattern, 'MATCH')).toBe('Location is MATCH.');
    });

    test('returns appropriate link url', () => {
      Platform.OS = 'android';
      expect(LatLngMatcher.getLinkUrl(['34.0522, -118.2437'])).toBe(
        'https://www.google.com/maps/search/?api=1&query=34.0522,-118.2437',
      );
      Platform.OS = 'ios';
      expect(LatLngMatcher.getLinkUrl(['34.0522, -118.2437'])).toBe(
        'http://maps.apple.com/?q=34.0522%2C%20-118.2437&ll=34.0522,-118.2437',
      );
    });
  });
});
