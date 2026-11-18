/*!
 * React Native Autolink
 *
 * Copyright 2016-2026 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/main/LICENSE
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
      expect('At -33.86,151.21 now'.replace(LatLngMatcher.pattern, 'MATCH')).toBe('At MATCH now');
    });

    test.each(['Price is $1,250 today', '1999, 2000 and 2001', 'lat 91.5, 10', '45.0, 181'])(
      'does not match inside longer numbers or out-of-range values: %s',
      (sample) => {
        expect(sample.match(LatLngMatcher.pattern)).toBeNull();
      },
    );

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
