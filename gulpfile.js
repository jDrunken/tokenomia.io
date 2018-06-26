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
gulp.task('help',function () {
    var comment = `
토크노미아 사이트를 static하게 만들어냅니다.



# 환경설정

> npm install gulp -g
전역으로 gulp 설치가 완료되고 나면 사전 정의된 각종 플러그인을 설치합니다.

> npm install --save

설치가 마무리되면 아래처럼 명령어를 실행합니다.
명령어는 두가지 입니다.



# 실행

로컬에서 실행해볼떄
> gulp local

배포용
> gulp deploy

자세한 사항은 readme를 참조하세요.
    `;

    console.log(comment);
});



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
    return gulp.src(path.source.html + '/*.html')
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


// image :: local, copy & injection
gulp.task('copy:image', function () {
    return gulp.src(path.source.image + '/*.{jpg,png,gif,svg}')
        .pipe(gulp.dest(path.deploy + '/image'))
        .pipe(livereload());
});

// --------------------------------------------------------------------------------
// pipe running
// --------------------------------------------------------------------------------
gulp.task('default', ['help']);

gulp.task('local', function () {
    runSequence('clean','html','copy:image','convert:sass:sourcemap',['connect','watch']);
});

// 이게 거의 최종본
// gulp.task('local', function () {
//     runSequence('clean','copy:image','convert:sass:sourcemap','copy:conf','html',['copy:js','copy:node_modules'],['connect','watch']);
// });


gulp.task('deploy',function () {
    runSequence('clean','copy:image','convert:sass','copy:conf','html',['copy:js','copy:node_modules'],'release');
});