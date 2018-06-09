var gulp = require('gulp');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var vinyl = require('vinyl-source-stream');
var fs = require('fs');

deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath;
      curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var env = {
  paths: {
    assets: './app/assets/**/*.*',
    app: './app',
    dist: './dist',
    js: '/js',
    css: './app/css/**/*.css',
    entryFile: './app/js/app.js',
    htmls: './app/html/*',
    jsFiles: './app/js/**/*.js',
    mainJsFileOutput: 'main.js'
  },
  release: false,
  htmlOutputFilename: 'index.html'
}

gulp.task('clean', function(cb) {
  return deleteFolderRecursive(env.paths.dist);
});

gulp.task('copy-assets', function() {
  return gulp.src(env.paths.assets, {
    base: env.paths.app
  }).pipe(gulp.dest(env.paths.dist));
});

gulp.task('compile-css', function() {
  return gulp.src(env.paths.css)
             .pipe(stylus({
                compress: !env.release
              }))
             .pipe(gulp.dest(env.paths.dist));
});

gulp.task('compile-js', function() {
  if (env.release) {
    return browserify(env.paths.entryFile, {
      debug: false
    }).bundle()
      .pipe(vinyl(env.paths.mainJsFileOutput))
      .pipe(buffer())
      .pipe(uglify({
        compress: true
      }))
      .pipe(gulp.dest(env.paths.dist));
  } else {
    return browserify(env.paths.entryFile, {
        debug: true
      })
      .bundle()
      .pipe(vinyl(env.paths.mainJsFileOutput))
      .pipe(gulp.dest(env.paths.dist));
  }
});

gulp.task('copy-htmls', function() {
  return gulp.src(env.paths.htmls)
             .pipe(gulp.dest(env.paths.dist));
});

gulp.task('copy-css', function() {
  return gulp.src(env.paths.css)
             .pipe(gulp.dest(env.paths.dist));
});

gulp.task('build', ['clean', 'compile-js', 'copy-assets', 'compile-css', 'copy-htmls', 'copy-css']);
gulp.task('default', ['clean']);
