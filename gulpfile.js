var gulp = require('gulp');

var browserify = require('browserify');
var browserSync = require('browser-sync');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');

// Start server
gulp.task('serve', function () {
  browserSync({
    server: './Build'
  });
});

// Copy data
gulp.task('data', function() {
  gulp.src('./src/js/data/*.json')
    .pipe(gulp.dest('./Build/js/data'))
});

// Templates task
gulp.task('templates', function() {
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./Build'))
    .pipe(reload({stream: true}))
});

// Sass task
gulp.task('sass', function(event) {
  return gulp.src(['./src/scss/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./Build/css'))
    .pipe(reload({stream: true}))
});

// JS task
gulp.task('js', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });
  return gulp.src('./src/js/*.js')
    .pipe(browserified)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./Build/js'))
    .pipe(reload({stream: true}))
});

// Default task
gulp.task('default', ['serve', 'data', 'templates', 'sass', 'js'], function() {
  gulp.watch('./src/*.html', ['templates']);
  gulp.watch(['./src/scss/*.scss', './src/scss/**/*.scss'], ['sass']);
  gulp.watch('./src/js/*.js', ['js']);
});
