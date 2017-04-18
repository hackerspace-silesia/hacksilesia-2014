var gulp = require("gulp");
//Global
var concat = require("gulp-concat");
//JS
var uglify = require('gulp-uglify');
//CSS
var uncss = require('gulp-uncss');
var cssnano = require('gulp-cssnano');
//HTML
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');


var UGLIFY = {
    sequences: true, // join consecutive statemets with the “comma operator”
    properties: true, // optimize property access: a["foo"] → a.foo
    dead_code: true, // discard unreachable code
    drop_debugger: true, // discard “debugger” statements
    unsafe: true, // some unsafe optimizations (see below)
    conditionals: true, // optimize if-s and conditional expressions
    comparisons: true, // optimize comparisons
    evaluate: true, // evaluate constant expressions
    booleans: true, // optimize boolean expressions
    loops: true, // optimize loops
    unused: true, // drop unused variables/functions
    hoist_funs: true, // hoist function declarations
    hoist_vars: true, // hoist variable declarations
    if_return: true, // optimize if-s followed by return/continue
    join_vars: true, // join var declarations
    cascade: true, // try to cascade `right` into `left` in sequences
    side_effects: true, // drop side-effect-free statements
    warnings: true, // warn about potentially dangerous optimizations/code
    global_defs: {} // global definitions
};

var HTMLMIN = {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
};

var UNCSS = {
    html: ['./src/index.html'],
    ignore: [
        /navbar-shrink/,
        /active/,

    ]
};
//
var CSS_CONFIG = {
    noAdvanced: true
};

function getPath(type) {
    return "./src/**/*." + type;
}


gulp.task('copy', function () {
    var FONTSTYPES = [
        'eot',
        'svg',
        'ttf',
        'woff'
    ];
    gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./deploy/img'));

    FONTSTYPES.forEach(function (font) {
        gulp.src('./src/**/*' + font)
            .pipe(gulp.dest('./deploy'));
    });

    gulp.src('./CNAME')
        .pipe(gulp.dest('./deploy'));
});

gulp.task('watch', function () {
    gulp.watch('./gulpfile.js', ['copy', 'scripts', 'html', 'css']);
    gulp.watch(getPath('js'), ['scripts']);
    gulp.watch(getPath('html'), ['html']);
    gulp.watch(getPath('css'), ['css', 'copy']);
});

gulp.task('css', [], function () {
    gulp.src([
        "./src/css/min/bootstrap.css",
        "./src/css/min/font-awesome.css",
        "./src/css/agency.css",
    ])
        // .pipe(uncss(UNCSS))
        .pipe(cssnano(CSS_CONFIG))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./deploy/css'));
});

gulp.task('html', function () {
    gulp.src(getPath('html'))
        .pipe(htmlreplace({
          js: 'js/scripts.min.js',
          css: 'css/style.min.css'
        }))
        .pipe(htmlmin(HTMLMIN))
        .pipe(gulp.dest('./deploy'));
});


gulp.task('scripts', function () {
    gulp.src([
        'src/js/vendor/jquery-2.1.1.js',
        'src/js/vendor/bootstrap.js',
        'src/js/libs/**/*.*',
        'src/js/map.js'
      ])
      .pipe(uglify(UGLIFY))
      .pipe(concat('scripts.min.js'))
      .pipe(gulp.dest('./deploy/js'));

});

gulp.task('default', ['copy', 'css', 'html', 'scripts']);
