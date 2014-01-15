module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-remote-task');

    grunt.initConfig({
        watch: {
            options: {
                spawn: false,
            },
            html: {
                tasks: ['remoteTask:html'],
                files: [
                    '*.html',
                ],
            },
            css: {
                tasks: ['remoteTask:css'],
                files: [
                    '*.css',
                ],
            },
        },
        remoteTask: {
            options: {
                addr: '0.0.0.0',
                port: 12345,
                sshEnv: true
            },
            html: ['example:html'],
            css: ['example:css'],
        },
        example: {
            html: {},
            css: {},
        }
    });

    grunt.registerMultiTask('example', function () {
        grunt.log.writeln("Run " + this.nameArgs + " task");
    });

    grunt.registerTask('default', ['remoteTask:listen', 'watch']);
    grunt.registerTask('wait', ['remoteTask:wait']);
};
