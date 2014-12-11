module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.initConfig({

        clean: ["dist"],

        uglify: {

            options: {
                mangle: false
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

            main: {

                files: [

                    {expand: true, cwd: 'src/scripts/lib/', src: ['**'], dest: 'dist/scripts/lib'},
                    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images'},
                    {expand: true, cwd: 'src/templates/', src: ['**'], dest: 'dist/templates'},
                    {src: 'src/index.html', dest: 'dist/index.html'}

                ]

            }

        }

    });

};
