var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

var jsFiles = [
	'gulpfile.js',
	'src/**/*.js',
	'tests/**/*.js'
];

function Lint() {
    return gulp.src(jsFiles)
        .pipe(jshint({
            evil: true
        }))
        .pipe(jshint.reporter('jshint-stylish'));
}
function Test(reporter) {
    return gulp.src('tests/**/*.js')
        .pipe(mocha({reporter: reporter}))
        .on('error', function() {});
}

////////////////
// User tasks //
////////////////
gulp.task('default', ['lint', 'test', 'watch']);

gulp.task('lint', Lint);

gulp.task('test', ['lint'], Test.bind(this, 'spec'));

gulp.task('tdd', ['lint'], Test.bind(this, 'dot'));

gulp.task("watch", function() {
    return gulp.watch(jsFiles, ['lint', 'tdd']);
});

//////////////
// CI tasks //
//////////////
gulp.task('ciLint', function() {
    return Lint().pipe(jshint.reporter('fail'));
});

gulp.task('ciTest', ['ciLint'], Test.bind(this, 'spec'));

gulp.task('ci', ['ciLint', 'ciTest']);