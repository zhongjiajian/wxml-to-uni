var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var del = require('del');
const {
  exec
} = require('child_process');

var paths = {
  example: {
    wxmls: 'example/input/*.wxml',
    js: 'example/**/*.js'
  },
  scripts: {
    src: 'src/**/*.js',
    dest: 'lib/'
  }
};


function cleanLib() {
  return del(['lib']);
}



function watch() {
  gulp.watch([paths.scripts.src, paths.example.wxmls], runExample);
}
function runExample(cb) {
  exec('node example/index.js', (err, stdout, stderr) => {
    if (err) return console.log(err);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    cb()
  })

}

function buildScripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

var clean = cleanLib;
var dev = runExample
var build = gulp.series(cleanLib, buildScripts);

exports.clean = clean;
exports.dev = dev;
exports.watch = watch;
exports.build = build;
exports.default = build;