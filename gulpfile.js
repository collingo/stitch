var gulp = require('gulp');
var jshint = require('gulp-jshint');

var jsFiles = [
	'gulpfile.js',
	'src/**/*.js'
];

gulp.task('default', ['lint', 'watch']);

gulp.task("watch", function() {
    gulp.watch(jsFiles, ['lint']);
});

gulp.task('lint', function() {
    return gulp.src(jsFiles)
        .pipe(jshint({
        	evil: true
        }))
        .pipe(jshint.reporter('default'));
});