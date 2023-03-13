/*!
 * React Native Autolink
 *
 * Copyright 2016-2023 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import { IntlPhoneMatcher, PhoneMatchersByCountry } from '..';

const getText = (number: string) => `Phone number is ${number}.`;
const resultText = 'Phone number is MATCH.';

describe('Phone matchers', () => {
  describe('Generic', () => {
    test('matches common international phone numbers', () => {
      expect(getText('+12317527630').replace(IntlPhoneMatcher.pattern, 'MATCH')).toBe(resultText);
      expect(getText('+4915789173959').replace(IntlPhoneMatcher.pattern, 'MATCH')).toBe(resultText);
      expect(getText('+33699520828').replace(IntlPhoneMatcher.pattern, 'MATCH')).toBe(resultText);
      expect(getText('+48571775914').replace(IntlPhoneMatcher.pattern, 'MATCH')).toBe(resultText);
      expect(getText('+447487428082').replace(IntlPhoneMatcher.pattern, 'MATCH')).toBe(resultText);
    });

    test('returns appropriate link url', () => {
      expect(IntlPhoneMatcher.getLinkUrl(['+14085550123'])).toBe('tel:+14085550123');
    });
  });

  describe('PhoneMatchersByCountry', () => {
    test('returns appropriate link url', () => {
      expect(PhoneMatchersByCountry.US.getLinkUrl(['+1 (408) 555-0123'])).toBe('tel:+14085550123');
    });

    test('matches French phone numbers', () => {
      expect(getText('+33699520828').replace(PhoneMatchersByCountry.FR.pattern, 'MATCH')).toBe(
        resultText,
      );
    });

    test('matches Polish phone numbers', () => {
      expect(getText('+48571775914').replace(PhoneMatchersByCountry.PL.pattern, 'MATCH')).toBe(
        resultText,
      );
    });

    test('matches UK phone numbers', () => {
      expect(getText('+447487428082').replace(PhoneMatchersByCountry.UK.pattern, 'MATCH')).toBe(
        resultText,
      );
    });

    test('matches US phone numbers', () => {
      expect(getText('+12317527630').replace(PhoneMatchersByCountry.US.pattern, 'MATCH')).toBe(
        resultText,
      );
    });
  });
});
