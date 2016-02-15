var gulp = require('gulp');
var notify = require('gulp-notify');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


/*
    Styles Task
*/

gulp.task('styles',function() {

    // Compiles CSS
    gulp.src('sass-files/styles.scss')
        .pipe(sass.sync().on('error', handleErrors))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./build/css'))
});

/*
    Scripts task
*/

gulp.task('scripts',function() {

    gulp.src('scripts/main.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./build'))
});

/*
    Display notification on error
*/

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}


gulp.task('default', ['styles','scripts'], function() {
  gulp.watch('sass-files/**/*', ['styles']);
  gulp.watch('scripts/main.js', ['scripts']);
});
