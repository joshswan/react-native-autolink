/*!
 * React Native Autolink
 *
 * Copyright 2016-2019 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

require('react-native-mock-render/mock');
require('@babel/register')({
  only: [
    'src/**/*.js',
    'test/**/*.js',
    'node_modules/autolinker/dist/es2015/**/*.js',
  ],
});
