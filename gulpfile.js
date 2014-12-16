var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('default', ['scripts', 'html']);

gulp.task('scripts', function() {
	return gulp.src('javascript/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('public/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

gulp.task('html', function () {
	return gulp.src('index.html')
		.pipe(gulp.dest('public'));
})

gulp.task('watch', function() {
	gulp.watch('javascript/*.js', ['scripts']);
	gulp.watch('index.html', ['html']);

	// Create LiveReload server
	livereload.listen();

// Watch any files in dist/, reload on change
	gulp.watch(['public/**']).on('change', livereload.changed); 
});