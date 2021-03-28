/*!
 * React Native Autolink
 *
 * Copyright 2016-2021 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import type { CustomMatcher } from '../CustomMatch';

export const IntlPhoneMatcher: CustomMatcher = {
  pattern: /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}/g,
  type: 'phone-intl',
  getLinkUrl: ([number]) => `tel:${number}`,
};

// NOTE: These patterns don't support extensions (i.e. "x" or "ext")
const patternsByCountry = {
  // France
  FR: /(\+33|0|0033)[1-9]\d{8}/g,
  // Poland
  PL: /(?:(?:(?:\+|00)?48)|(?:\(\+?48\)))?(?:1[2-8]|2[2-69]|3[2-49]|4[1-8]|5[0-9]|6[0-35-9]|[7-8][1-9]|9[145])\d{7}/g,
  // United Kingdom
  UK: /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))/g,
  // United States
  US: /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/g,
};

export const PhoneMatchersByCountry = Object.entries(patternsByCountry).reduce(
  (matchers, [countryCode, pattern]) => ({
    ...matchers,
    [countryCode]: {
      pattern,
      type: `phone-${countryCode}`,
      getLinkUrl: ([number]) => `tel:${number.replace(/[^\d+]/g, '')}`,
    } as CustomMatcher,
  }),
  {} as Record<keyof typeof patternsByCountry, CustomMatcher>,
);
