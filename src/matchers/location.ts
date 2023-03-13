/*!
 * React Native Autolink
 *
 * Copyright 2016-2021 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import { Platform } from 'react-native';
import type { CustomMatcher } from '../CustomMatch';

export const LatLngMatcher: CustomMatcher = {
  pattern:
    /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g,
  type: 'latlng',
  getLinkUrl: ([latlng]) => {
    const query = latlng.replace(/\s/g, '');
    return Platform.OS === 'ios' || Platform.OS === 'macos'
      ? `http://maps.apple.com/?q=${encodeURIComponent(latlng)}&ll=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
  },
};
