import gulp from "gulp";
import nodeSass from "node-sass"; // Add this line
import gulpSass from "gulp-sass"; // Import gulp-sass
import prefix from "gulp-autoprefixer";
import plumber from "gulp-plumber";
import cleanCSS from "gulp-clean-css";
import beautify from "gulp-beautify";
import uglify from "gulp-uglify";
import babel from "gulp-babel";
import pipeline from "readable-stream";
import sourcemaps from "gulp-sourcemaps";

const sassCompiler = gulpSass(nodeSass); // Pass the node-sass compiler to gulp-sass

export const scss = async () => {
  return gulp
    .src("scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sassCompiler()) // Remove the .on("error", sass.logError) part
    .pipe(prefix("last 2 versions"))
    .pipe(cleanCSS())
    .pipe(beautify.css({ indent_size: 2 }))
    .pipe(sourcemaps.write("../css/map"))
    .pipe(gulp.dest("css"));
};

export const watch = async () => {
  gulp.watch("scss/**/*.scss", gulp.series(scss));
};

export default gulp.series(scss, watch);

