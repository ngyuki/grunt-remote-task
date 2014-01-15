
## Example

**Should be synchronized files in local and remote hosts**

Install Grunt

```console
$ echo '{}' > package.json
$ npm install --save-dev grunt grunt-contrib-watch ngyuki/grunt-remote-task
```

Create Gruntfile.js

```console
$ vi Gruntfile.js
```

*Gruntfile.js*

```js
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
```

Create misc files

```console
$ touch hoge.html
$ touch hoge.css
```

Run Grunt in local host

```console
$ grunt
```

Run Grunt in remote host

```console
# grunt wait
```

Edit misc files in local host

```console
$ echo hoge > hoge.html
$ echo hoge > hoge.css
```

Ran `example:html` and `example:css` tasks in remote host
