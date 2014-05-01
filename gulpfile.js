var lr = require('tiny-lr');
var gulp = require('gulp');
var gulputil = require('gulp-util');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var less = require('gulp-less');
var bower = require('gulp-bower');

server = lr();

var publicFolder = 'public/';

gulp.task('bower', function() {

    bower()
        .pipe(gulp.dest(publicFolder+'lib/'));

});
gulp.task('build', ['bower'], function() {
    gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest(publicFolder+'css/'));

});

gulp.task('default', ['bower','listen'], function() {
    gulp.src(publicFolder+'*')
        .pipe(watch())
        .pipe(livereload(server));

    gulp.src('less/*.less')
        .pipe(watch())
        .pipe(less())
        .pipe(gulp.dest(publicFolder+'css/'))
        .pipe(livereload(server));
});

gulp.task('listen', function(next) {
    server.listen(35729, function(err) {
        if (err) return console.error(err);
        next();
    });
});