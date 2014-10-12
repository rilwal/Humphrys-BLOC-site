module.exports = function (grunt) {
    grunt.initConfig({
        clean: ["dist"],
        uglify: {
            minify: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: '*.js',
                    dest: 'dist/js'
                }]
            }
        },
        cssmin: {
            minify: {
//                src: 'src/css/style.css',
//                dest: 'dist/css/style.css'
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: '*.css',
                    dest: 'dist/css'
                }]
            }
        },
        htmlmin: {
            minify: { 
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeOptionalTags: true,
                    minifyURLs: true,
                    minifyJS: true,
                    minifyCSS: true,
                    
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '*.html',
                    dest: 'dist'
                }]
            } 
        },
        imagemin: {
            minfy: {
                files: [{
                    expand: true,
                    cwd: 'src/img',
                    src: '*.{png,jpg,gif}',
                    dest: 'dist/img'
                }] 
            }
        },
        exec: {
            deploy: {
                command: "./deploy.sh",
                stdout: true
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-exec');

    
    grunt.registerTask('deploy', ['exec'])
    grunt.registerTask('default', ['clean', 'htmlmin', 'cssmin', 'uglify', 'imagemin']);
};