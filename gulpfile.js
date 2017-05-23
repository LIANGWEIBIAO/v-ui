/*  工具基本库  */
const gulp = require('gulp')                    // 引入gulp基础库
const watch = require('gulp-watch')             // 监听
const plumber = require('gulp-plumber')         // 防止编译错误报错终止监听
const connect = require('gulp-connect')         // 启动WEB服务，热加载
const cache = require('gulp-cache')             // 拉取缓存

/*  htmlmin  */
const jade = require('gulp-jade');
const htmlmin = require('gulp-htmlmin')
/*  css  */
const minifyCSS = require('gulp-minify-css')    // css压缩
const autoprefixer = require('gulp-autoprefixer') // 兼容前缀
/*  javascript  */
const uglify = require('gulp-uglify')           // JS代码压缩
const babel = require('gulp-babel')             // ES6转换（gulp-babel babel-preset-es2015）
/*  images  */
const imagemin = require('gulp-imagemin')       // 图片压缩

/*  dist输出路径  */
const DIST_PATH = 'dist'
/*  build输出路径  */
const BUILD_PATH = 'build'

gulp.task('connect', function() {
    connect.server({
        port: 8080,
        root: './dist',
        livereload: true
    })
})

/*  将html复制到dist目录  */
gulp.task('html', () => {
    gulp.src('./src/**/*.html')
        .pipe(plumber())
        // .pipe(jade())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(connect.reload())
})

/*  task:编译sass，并输出到dist/css目录下  */
gulp.task('sass', () => {
    return gulp.src('src/css/**/*.css')
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(gulp.dest(DIST_PATH + '/css'))
        .pipe(connect.reload())
})
/*  task:JavaScript通过babel转化es5，并输出到dist/js目录下  */
gulp.task('js', () => {
    gulp.src('./src/js/**/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(DIST_PATH + '/js'))
        .pipe(connect.reload())
})
/*  压缩图片  */
gulp.task('images', () => {
    return watch('src/images/**/*.{png,jpg,gif,ico,JPG,PNG,GIF,ICO}', () => {
        gulp.src('src/images/**/*.{png,jpg,gif,ico,JPG,PNG,GIF,ICO}')
            .pipe(cache(imagemin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            })))
            .pipe(gulp.dest(DIST_PATH + '/images'))
            .pipe(connect.reload())
    })
})
/* font */
gulp.task('font', ()=> {
    return gulp.src('src/font/**/*')
        .pipe(gulp.dest(DIST_PATH + '/font'))
})

// 自动监听
gulp.task('auto', () => {
    gulp.watch('src/**/*.html', ['html']),
    gulp.watch('src/js/*', ['js']),
    gulp.watch('src/css/*', ['sass']),
    gulp.watch('src/images/*)', ['images'])
    gulp.watch('src/css/font/**/*)', ['font'])
})

// 默认动作
gulp.task('default', ['html',  'js', 'sass', 'images', 'auto', 'connect', 'font'])