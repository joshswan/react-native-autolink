/*!
 * React Native Autolink
 *
 * Copyright 2016 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */
'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function() {
  gulp.src(['src/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('default', ['build']);
