var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

var jsFiles = [
	'gulpfile.js',
	'src/**/*.js',
	'tests/**/*.js'
];

gulp.task('default', ['lint', 'test', 'watch']);

gulp.task('lint', function() {
    return gulp.src(jsFiles)
        .pipe(jshint({
        	evil: true
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('test', ['lint'], function () {
    return gulp.src('tests/**/*.js')
        .pipe(mocha({reporter: 'dot'}))
        .on('error', function() {});
});

gulp.task("watch", function() {
    return gulp.watch(jsFiles, ['lint', 'test']);
});