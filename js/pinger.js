const {spawn} = require('child_process');
const {EventEmitter} = require('events');
const readline = require('readline');
const validator = require('validator');
const fs = require('fs');

class Pinger extends EventEmitter {
    constructor(target) {
        super();

        this.command = 'ping';
        this.args = ['-t'];
        this.process = null;
        this.writeStream = null;
        this.target = target;

        if(this.isValidDomainName(target)) {
            this.args.push(target);
        } else {
            throw new Error('Provided target to ping is not valid domain name nor ip.')
        }
    }

    start() {
        this.handleLogsDir();
        this.handleLogsFile();

        this.process = spawn(this.command, this.args);
        this.process.on('close', (code) => {
            this.writeStream.end();
            this.emit('close', code);
        });

        this.emit('pid', this.process.pid);

        if (this.process.pid) {
            readline.createInterface({
                input: this.process.stdout,
                terminal: false
            }).on('line', (line) => {
                this.writeStream.write(`[${new Date().toLocaleTimeString()}]${line}\n`);
                this.emit('ping', line);
            });
        }
    }

    handleLogsDir() {
        const currentDate = new Date();
        const dirName = `${currentDate.getDate()}_${currentDate.getMonth()}_${currentDate.getFullYear()}`;

        if(!fs.existsSync(dirName)) {
            fs.mkdir(dirName);
        }
    }

    handleLogsFile() {
        const currentDate = new Date();
        const dirName = `${currentDate.getDate()}_${currentDate.getMonth()}_${currentDate.getFullYear()}`;

        this.writeStream = fs.createWriteStream(`${dirName}/${this.target.replace('.', '_')}.txt`);
    }

    stop() {
        this.writeStream.end();
        this.process.kill('SIGINT');
    }

    isValidDomainName(target) {
        return validator.isFQDN(target + '') || validator.isIP(target + '');
    }
}

module.exports = Pinger;