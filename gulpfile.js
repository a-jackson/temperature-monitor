var gulp = require('gulp');
var install = require('gulp-install');

const PROD_DEST = 'dist';

gulp.task('default', function() {
    return gulp
        .src(['./package.json'])
        .pipe(gulp.dest(PROD_DEST))
        .pipe(
            install({
                args: ['--production'],
            }),
        );
});
