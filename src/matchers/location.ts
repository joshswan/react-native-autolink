/*!
 * React Native Autolink
 *
 * Copyright 2016-2026 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/main/LICENSE
 */

import { Platform } from 'react-native';
import type { CustomMatcher } from '../CustomMatch';
import { bounded } from './bounded';

export const LatLngMatcher: CustomMatcher = {
  // Don't match inside longer numbers ("$1,250") or truncate out-of-range values ("45.0, 181"),
  // but still allow a sentence-ending period after the longitude.
  pattern: bounded(
    /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g,
    { before: '[\\d.]', after: '\\.?\\d' },
  ),
  type: 'latlng',
  getLinkUrl: ([latlng]) => {
    const query = latlng.replace(/\s/g, '');
    return Platform.OS === 'ios' || Platform.OS === 'macos'
      ? `http://maps.apple.com/?q=${encodeURIComponent(latlng)}&ll=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
  },
};
