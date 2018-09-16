const {spawn} = require('child_process');
const {EventEmitter} = require('events');
const readline = require('readline');
const validator = require('validator');

class Process extends EventEmitter {
    constructor(command, args) {
        super();

        this.command = command;
        this.args = args;
        this.process = null;
    }

    trace(domainName) {
        if (!this.isValidDomainName(domainName)) {
            throw "Invalid domain name or IP address";
        }

        this.args.push(domainName);

        this.process = spawn(this.command, this.args);
        this.process.on('close', (code) => {
            this.emit('close', code);
        });

        this.emit('pid', this.process.pid);

        let isDestinationCaptured = false;
        if (this.process.pid) {
            readline.createInterface({
                input: this.process.stdout,
                terminal: false
            })
                .on('line', (line) => {
                    if (!isDestinationCaptured) {
                        const destination = this.parseDestination(line);
                        if (destination !== null) {
                            this.emit('destination', destination);

                            isDestinationCaptured = true;
                        }
                    }

                    const hop = this.parseHop(line);
                    if (hop !== null) {
                        this.emit('hop', hop);
                    }
                });
        }
    }

    stop() {
        this.process.kill('SIGINT');
    }

    isValidDomainName(domainName) {
        return validator.isFQDN(domainName + '') || validator.isIP(domainName + '');
    }

    parseDestination(data) {
    }

    parseHop(hopData) {
    }
}

module.exports = Process;
