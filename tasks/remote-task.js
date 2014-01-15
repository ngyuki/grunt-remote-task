'use strict';

var net = require('net');

module.exports = function (grunt) {

    // peer socket list
    var remotes = [];

    // client socket
    var client = null;

    grunt.registerTask('remoteTask', function() {

        var options = this.options({
            addr: '127.0.0.1',
            port: 12345,
            sshEnv: false
        });

        if (this.flags.listen)
        {
            // server listen
            net.createServer(function (socket) {

                var desc = socket.remoteAddress + ':' + socket.remotePort;

                socket.on('end', function () {

                    remotes.splice(remotes.indexOf(socket), 1);
                    grunt.log.writeln("remoteTask disconnect... " + desc);

                });

                remotes.push(socket);

                grunt.log.writeln("remoteTask connect ... " + desc);

            }).listen(options.port, options.addr);

            grunt.log.writeln("remoteTask listen ... " + options.addr + ":" + options.port);
        }
        else if (!this.flags.wait)
        {
            // server send
            var data = this.args.join('.');

            remotes.forEach(function (socket) {
                socket.write(data + "\n");
            });

            grunt.log.writeln("remoteTask send ... " + data + " to " + remotes.length + " clients");
        }
        else
        {
            // client recv
            var done = this.async();
            var addr = options.addr;

            if (options.sshEnv)
            {
                if (!process.env.SSH_CLIENT)
                {
                    grunt.fail.fatal("remoteTask require env.SSH_CLIENT when using options.sshEnv");
                }

                addr = process.env.SSH_CLIENT.split(' ')[0];
            }

            var desc = addr + ':' + options.port;

            if (!client)
            {
                client = net.createConnection(options.port, addr);
                grunt.log.writeln("remoteTask connect ... " + desc);

                client.on('data', function(data){

                    var target = data.toString().replace(/\n$/, '');
                    grunt.log.writeln("remoteTask recv ... " + target);

                    var tasks = grunt.config(this.name + '.' + target);
                    tasks.push(this.nameArgs);

                    grunt.task.run(tasks);
                    done();

                }.bind(this));

                client.on('end', function(){

                    grunt.log.writeln("remoteTask disconnect ... " + desc);
                    client = null;
                    done();

                }.bind(this));
            }
        }
    });
};
