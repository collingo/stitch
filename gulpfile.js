var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');

gulp.task('default', ['lint', 'scripts', 'watch']);

gulp.task("watch", function() {
    gulp.watch(['src/**/*.js', '!./node_modules/**/*', '!./www/**/*'], ['lint', 'scripts']);
});

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!./node_modules/**/*', '!./www/**/*'])
        .pipe(jshint({
        	evil: true
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
	gulp.src('src/index.js')
        .pipe(browserify({
          debug : true
        }))
        .pipe(gulp.dest('www'));
});