/*!
 * React Native Autolink
 *
 * Copyright 2016-2026 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/main/LICENSE
 */

import { bounded } from '../bounded';

describe('bounded', () => {
  test('rejects matches preceded or followed by the boundary patterns', () => {
    const pattern = bounded(/\d{3}/g, { before: '\\d', after: '\\d' });

    expect('a 123 b'.match(pattern)).toEqual(['123']);
    expect('a 1234 b'.match(pattern)).toBeNull();
    expect(pattern.flags).toBe('g');
  });

  test('keeps the original capture groups', () => {
    const pattern = bounded(/(\d)-(\d)/, { before: '\\d', after: '\\d' });

    expect('1-2'.match(pattern)?.slice(1)).toEqual(['1', '2']);
  });

  test('falls back to only checking the end when lookbehind is unsupported', () => {
    const NativeRegExp = RegExp;
    const spy = jest.spyOn(global, 'RegExp').mockImplementation((source, flags) => {
      if (String(source).includes('(?<!')) throw new SyntaxError('Invalid group');
      return new NativeRegExp(source, flags);
    });

    try {
      const pattern = bounded(/\d{3}/g, { before: '\\d', after: '\\d' });

      expect('a 123 b'.match(pattern)).toEqual(['123']);
      expect('a 1234 b'.match(pattern)).toEqual(['234']);
    } finally {
      spy.mockRestore();
    }
  });
});
