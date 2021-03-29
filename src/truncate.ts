/*!
 * React Native Autolink
 *
 * Copyright 2016-2021 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import { truncateEnd as end } from 'autolinker/dist/es2015/truncate/truncate-end';
import { truncateMiddle as middle } from 'autolinker/dist/es2015/truncate/truncate-middle';
import { truncateSmart as smart } from 'autolinker/dist/es2015/truncate/truncate-smart';

export { end, middle, smart };

export const truncate = (text: string, length = 32, chars = '..', location = 'smart'): string => {
  let fn;

  switch (location) {
    case 'end':
      fn = end;
      break;
    case 'middle':
      fn = middle;
      break;
    default:
      fn = smart;
  }

  return fn(text, length, chars);
};
