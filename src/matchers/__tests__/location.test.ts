/*!
 * React Native Autolink
 *
 * Copyright 2016-2021 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import { LatLngMatcher } from '..';

describe('Location matchers', () => {
  describe('LatLngMatcher', () => {
    test('matches latitude/longitude pair in text', () => {
      const text = 'Location is 34.0522, -118.2437.';
      expect(text.replace(LatLngMatcher.pattern, 'MATCH')).toBe('Location is MATCH.');
    });
  });
});
