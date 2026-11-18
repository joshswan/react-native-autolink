/*!
 * React Native Autolink
 *
 * Copyright 2016-2026 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/main/LICENSE
 */

interface Boundaries {
  /* Pattern that must not immediately precede the match */
  before: string;
  /* Pattern that must not immediately follow the match */
  after: string;
}

/**
 * Keeps a pattern from starting or ending in the middle of a longer token (e.g. a number).
 *
 * Older JavaScriptCore engines (iOS < 16.4) can't parse lookbehind assertions, so the start
 * check is dropped there rather than throwing when the module loads.
 */
export function bounded(pattern: RegExp, { before, after }: Boundaries): RegExp {
  const source = `(?:${pattern.source})(?!${after})`;

  try {
    return new RegExp(`(?<!${before})${source}`, pattern.flags);
  } catch {
    return new RegExp(source, pattern.flags);
  }
}
