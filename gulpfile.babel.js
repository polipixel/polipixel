import csso from 'gulp-csso';
import del from 'del';
import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import path from 'path';
import notify from 'gulp-notify';

const bs          = require('browser-sync').create();
const bourbon     = require('bourbon').includePaths;
const bootstrapJs = 'node_modules/bootstrap/dist/js/bootstrap.min.js';
const animate     = 'node_modules/animate-sass';
const breakpoint  = 'node_modules/breakpoint-sass/stylesheets';
const jquery      = 'node_modules/jquery/dist/jquery.js';

const paths = {
  styles: {
    src: './src/sass/styles.scss',
    dest: './dist/css/',
    watch: './src/sass/**/*.scss'
  },
  scripts: {
    src: './src/js/**/*.js',
    dest: './dist/js/'
  },
  html: {
    src: './src/**/*.html',
    dest: './dist/'
  },
  images: {
    src: './src/images/**/*.*',
    dest: './dist/images/'
  },
  distribution: './dist/'
};

// Configure the browser sync instance
export function browser_sync() {
  bs.init({
    watch: true,
    server: paths.distribution
  });
}

// Clean output directory
export const clean = () => del([ 'dist' ]);

// Minify SASS files
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.', bourbon, animate, breakpoint],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(csso())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(notify({ title: 'Web Dev Kit', message: 'Styles task complete', icon: path.join(__dirname, 'applogo.png') }));
}

// Minify JavaScript files
export function scripts() {
  return gulp.src([bootstrapJs, jquery, paths.scripts.src])
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(notify({ title: 'Web Dev Kit', message: 'Scripts task complete', icon: path.join(__dirname, 'applogo.png') }));
}

// Minify HTML files
export function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(notify({ title: 'Web Dev Kit', message: 'HTML task complete', icon: path.join(__dirname, 'applogo.png') }));
}

// Copy other assets
export function assets() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

// Watch Gulp changes
export function watch() {
  build();
  browser_sync();
  gulp.watch(paths.styles.watch, gulp.series('styles'));
  gulp.watch(paths.scripts.src, gulp.series('scripts'));
  gulp.watch(paths.html.src, gulp.series('html'));
}

// Default Gulp task
const build = gulp.series(clean, gulp.parallel(styles, scripts, html, assets));
export default build;
