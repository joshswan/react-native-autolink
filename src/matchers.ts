/*!
 * React Native Autolink
 *
 * Copyright 2016-2020 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import { Match, MatchConfig } from 'autolinker/dist/es2015';

export interface LatLngMatchConfig extends MatchConfig {
  latlng: string;
}

export class LatLngMatch extends Match {
  private latlng: string;

  constructor(cfg: LatLngMatchConfig) {
    super(cfg);

    this.latlng = cfg.latlng;
  }

  getType(): string {
    return 'latlng';
  }

  getLatLng(): string {
    return this.latlng;
  }

  getAnchorHref(): string {
    return this.latlng;
  }

  getAnchorText(): string {
    return this.latlng;
  }
}

export const CustomMatchers = {
  // LatLng
  latlng: {
    id: 'latlng',
    regex: /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g,
    Match: LatLngMatch,
  },
};

export type MatcherId = keyof typeof CustomMatchers;

export const Matchers = Object.keys(CustomMatchers).map((key) => CustomMatchers[key as MatcherId]);
