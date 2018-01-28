/*!
 * React Native Autolink
 *
 * Copyright 2016-2018 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import Autolinker from 'autolinker';

export default [
  // LatLng
  {
    id: 'latlng',
    regex: /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g,
    Match: Autolinker.Util.extend(Autolinker.match.Match, {
      constructor(cfg) {
        Autolinker.match.Match.prototype.constructor.call(this, cfg);

        this.latlng = cfg.latlng;
      },
      getType() {
        return 'latlng';
      },
      getLatLng() {
        return this.latlng;
      },
      getAnchorHref() {
        return this.latlng;
      },
      getAnchorText() {
        return this.latlng;
      },
    }),
  },
];
