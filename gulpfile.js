var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
	typescript = require('gulp-tsc'),
    del = require('del'),
	karma = require('karma').server,
	plumber = require('gulp-plumber');

gulp.task('default', ['test', 'html']);

gulp.task('vendor', function () {
	return gulp.src(['bower_components/jquery/dist/jquery.js'])
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

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

gulp.task('compile', function() {
	return gulp.src(['src/app.ts'])
		.pipe(plumber())
		.pipe(typescript({
			target: 'ES5',
			out: 'app.js',
			outDir: 'build',
			emitError: false,
			sourcemap: true,
			removeComments: false
		}))
		.pipe(gulp.dest('public/js'));
});

gulp.task('move', function () {
	return gulp.src('src/*.ts')
		.pipe(gulp.dest('public/src'));
});

gulp.task('typescript', ['move', 'compile']);

gulp.task('min', ['typescript'], function () {
	return gulp.src(['public/js.app.js'])
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/js'));
});

gulp.task('html', function () {
	return gulp.src('index.html')
		.pipe(gulp.dest('public'));
});

gulp.task('test', ['typescript'], function (done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);
});

gulp.task('watch', function() {
	gulp.watch('javascript/*.js', ['scripts']);
	gulp.watch('index.html', ['html']);

	gulp.watch(['test/**/*Spec.js', 'src/**/*.ts'], ['test']);

	// Create LiveReload server
	livereload.listen();

	gulp.watch(['public/**']).on('change', livereload.changed); 
});