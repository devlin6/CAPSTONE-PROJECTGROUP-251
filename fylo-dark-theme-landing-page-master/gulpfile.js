const gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    postcss = require('gulp-postcss'),
    postcssPresetEnv = require('postcss-preset-env'),
    purgecss = require('gulp-purgecss'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

const paths = {
    html: {
        src: './*.html',
        dest: './'
    },
    css: {
        src: './sass/**/*.scss',
        dest: './css/'
    }
};

function html() {
    return gulp
        .src(paths.html.src, {
            since: gulp.lastRun(html)
        })
        .pipe(gulp.dest(paths.html.dest));
}

function css() {
    return gulp
        .src('./sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([postcssPresetEnv({ stage: 0 })]))
        .pipe(
            purgecss({
                content: [paths.html.src]
            })
        )
        .pipe(
            rename({
                basename: 'style'
            })
        )
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browsersync.stream());
}

function watch() {
    browsersync.init({
        open: false,
        notify: false,
        server: {
            baseDir: './'
        }
    });
    gulp.watch(paths.css.src, css);
    gulp.watch(paths.html.src).on('change', browsersync.reload);
}

exports.html = html;
exports.css = css;
exports.watch = watch;
exports.default = watch;
