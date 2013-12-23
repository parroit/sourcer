'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            },
            working: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/documents-tabs_test.js']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', 'mochaTest');
    grunt.registerTask('test-working', 'mochaTest:working');

};