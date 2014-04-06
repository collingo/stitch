var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

gulp.task('default', ['lint', 'scripts', 'watch']);

gulp.task("watch", function() {
    gulp.watch(['src/**/*.js', '!./node_modules/**/*', '!./www/**/*'], ['lint', 'scripts']);
});

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!./node_modules/**/*', '!./www/**/*'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
	gulp.src('src/index.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : true
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./www'));
});