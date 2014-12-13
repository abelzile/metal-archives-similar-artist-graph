module.exports = function(grunt) {

    grunt.initConfig({

        clean: ['dist'],

        uglify: {

            options: {
                mangle: true
            },
            my_target: {

                files: [

                    {expand: true, cwd: 'src/scripts/app/', src: '**/*.js', dest: 'dist/scripts/app'}

                ]

            }

        },

        cssmin: {

            my_target: {

                files: [

                    {expand: true, cwd: 'src/styles/', src: '**/*.css', dest: 'dist/styles'}

                ]

            }

        },

        copy: {

            my_target: {

                files: [

                    {expand: true, cwd: 'src/scripts/lib/backbone', src: ['**/backbone.js'], dest: 'dist/scripts/lib/backbone'},
                    {expand: true, cwd: 'src/scripts/lib/jquery/dist', src: ['**/jquery.min.js'], dest: 'dist/scripts/lib/jquery/dist'},
                    {expand: true, cwd: 'src/scripts/lib/jquery-dialogextend', src: ['**/jquery.dialogextend.js'], dest: 'dist/scripts/lib/jquery-dialogextend'},
                    {expand: true, cwd: 'src/scripts/lib/jqueryui-custom', src: ['**/*.min.js', '**/*.min.css', 'images/**'], dest: 'dist/scripts/lib/jqueryui-custom'},
                    {expand: true, cwd: 'src/scripts/lib/lodash/dist', src: ['**/lodash.min.js'], dest: 'dist/scripts/lib/lodash/dist'},
                    {expand: true, cwd: 'src/scripts/lib/requirejs', src: ['**/*.js'], dest: 'dist/scripts/lib/requirejs'},
                    {expand: true, cwd: 'src/scripts/lib/requirejs-text', src: ['**/*.js'], dest: 'dist/scripts/lib/requirejs-text'},
                    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images'},
                    {expand: true, cwd: 'src/templates/', src: ['**'], dest: 'dist/templates'},
                    {src: 'src/index.html', dest: 'dist/index.html'}

                ]

            }

        }

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('dist', ['clean', 'uglify', 'cssmin', 'copy']);

};
