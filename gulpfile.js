// plugin
var gulp  = require('gulp')

    // server + live-reload
	connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),

    // image minify
    imagemin = require('gulp-imagemin'),

    // task run sequancial
    runSequence = require('run-sequence'),

    // clean before running
    clean = require('del'),

    // styling
	sass = require('gulp-sass'),

    // for cross browsing
	autoprefixer = require('gulp-autoprefixer'),

    // source tracking
	sourcemaps = require('gulp-sourcemaps'),

    // simple html template
    extender = require('gulp-html-extend')

    // comment remove
    removeHtmlComment = require('gulp-remove-html-comments'),

    // get node_modules to build
    npmDist = require('gulp-npm-dist'),

    // change path name
    rename = require('gulp-rename'),

    // gulp-gh-pages
    publish = require('gulp-gh-pages'),

    // image inliner(for slow network)
    base64 = require('gulp-base64');



// 환경설정
var path = {
    source : {
        root     : 'source',
        style    : 'source/style',
        js       : 'source/js',
        template : 'source',
        image    : 'source/image',
        conf     : 'source/conf',
        html     : 'source/html'
    },
    deploy : 'deploy'
};

// 도움말



// 로컬 서버 설정 :: host 설정 해주지 않으면 외부에서 보이질 않는구나.
gulp.task('connect', function() {
	connect.server({
		root: path.deploy,
		port : 3040,
		livereload: true,
        directory:true,
        host:'0.0.0.0'
	});
});





// 파일 변경 감지 :: local
gulp.task('watch', function(callback) {
    livereload.listen();
    gulp.watch(path.source.js+'/*.js',['copy:js'],callback);
    gulp.watch(path.source.style+'/*.{scss,sass,css}',['convert:sass:sourcemap'],callback);

    // 탬플릿은 세밀하게 지정해줘야 될지도...
    gulp.watch([
        path.source.template+'/**/*.html',
        path.source.html+'/**/*.html',
    ], ['html'],callback);

    // 이미지 수정처리
    gulp.watch(path.source.root+'/**/*.{png,jpg,gif}', ['copy:image'],callback);
});



// 빌드 전 청소
gulp.task('clean',function () {
	return clean(path.deploy);
});




// html 처리
gulp.task('html',function () {
    return gulp.src(path.source.html + '/**/*.html')
        .pipe(extender({
            annotations: false,
            verbose: false
        })) // default options
        .pipe(removeHtmlComment())
        // image injection
        .pipe(gulp.dest(path.deploy))
        .pipe(livereload());
});

// scss 변환 :: local
gulp.task('convert:sass:sourcemap', function () {

    return gulp.src(path.source.style + '/**/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 11'],
            expand: true,
            flatten: true
        }))
        .pipe(base64({
            maxImageSize: 120*1024                                  // bytes,
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.deploy + '/css'))
        .pipe(livereload());
});


// scss 변환 :: deploy, sass > hack
gulp.task('convert:sass', function () {
    return gulp.src(path.source.style + '/**/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 10', 'ie 11'],
            expand: true,
            flatten: false
        }))
        // .pipe(base64({
        //     maxImageSize: 200*1024 // bytes
        // }))
        .pipe(gulp.dest(path.deploy + '/css'))
        .pipe(livereload());
});


// js 파일 :: local, 복사
gulp.task('copy:js',function () {
    return gulp.src(path.source.js + '/*.js')
        .pipe(gulp.dest(path.deploy + '/js'))
        .pipe(livereload());
});

npmDistExcludeJS = [
    '*.map',
    'src/**/*',
    'examples/**/*',
    'example/**/*',
    'demo/**/*',
    'spec/**/*',
    'docs/**/*',
    'tests/**/*',
    'test/**/*',
    'Gruntfile.js',
    'gulpfile.js',
    'package.json',
    'package-lock.json',
    'bower.json',
    'composer.json',
    'yarn.lock',
    'webpack.config.js',
    'README',
    'LICENSE',
    'CHANGELOG',
    '*.yml',
    '*.md',
    '*.coffee',
    '*.ts',
    '*.scss',
    '*.less',

    'core.js',
    'slim',
    'assets',
    // '*.css',
    '*.gif',
    'component.json',
    'slick.jquery.json',
    '*.rb',
    '*.markdown',
    '*.html',
    'MakeFile',
    '*.eot',
    '*.ttf',
    '*.woff',
    '*.svg',
    '*.png',
    'slick',
    'fonts'
];

gulp.task('copy:node_modules',function () {
    return gulp.src(
            npmDist({
                copyUnminified : false,
                slimexcludes : npmDistExcludeJS          // only import jquery
            }),
            {base : './node_modules'}
        )
        .pipe(rename(function(path) {
                path.dirname = '';
            }))
        .pipe(gulp.dest(path.deploy + '/js'))
        .pipe(livereload());
});


// conference file copy :: local, deploy 공통
gulp.task('copy:conf',function () {
    return gulp.src(path.source.conf + '/*')
        .pipe(gulp.dest(path.deploy))
        .pipe(livereload());
});


// image :: local, copy & injection
gulp.task('copy:image', function () {
    return gulp.src(path.source.image + '/*.{jpg,png,gif,svg}')
        .pipe(gulp.dest(path.deploy + '/image'))
        .pipe(livereload());
});

// 배포
gulp.task('release', function () {
    return gulp.src(path.deploy + '/**/*')
        .pipe(publish({
            force : true,
            message : 'TOKENomia :: 깃허브 페이지에 반영됨. Published to Github pages'
        }))
});
// --------------------------------------------------------------------------------
// pipe running
// --------------------------------------------------------------------------------
gulp.task('default', ['local']);

gulp.task('local', function () {
    runSequence('clean','copy:image','convert:sass:sourcemap','copy:conf','html',['copy:js','copy:node_modules'],['connect','watch']);
});

gulp.task('deploy',function () {
    runSequence('clean','copy:image','convert:sass','copy:conf','html',['copy:js','copy:node_modules'],'release');
});
