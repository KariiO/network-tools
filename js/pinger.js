const {spawn} = require('child_process');
const {EventEmitter} = require('events');
const readline = require('readline');
const fs = require('fs');

class Pinger extends EventEmitter {
    constructor() {
        super();

        this.command = 'ping';
        this.args = ['-t'];
        this.process = null;
        this.writeStream = null;
        this._target = null;
    }

    set target(value) {
        this._target = value;
    }

    start() {
        this.handleLogsDir();
        this.handleLogsFile();

        this.args.push(this._target);

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
                this.emit('ping', `[${new Date().toLocaleTimeString()}] ${line}`);
            });
        }
    }

    handleLogsDir() {
        const currentDate = new Date();
        const logsDirName = 'logs';
        const dirName = `${logsDirName}/${currentDate.getDate()}_${currentDate.getMonth()}_${currentDate.getFullYear()}`;

        if(!fs.existsSync(logsDirName)) {
            fs.mkdir(logsDirName);
        }

        if(!fs.existsSync(dirName)) {
            fs.mkdir(dirName);
        }
    }

    handleLogsFile() {
        const currentDate = new Date();
        const dirName = `logs/${currentDate.getDate()}_${currentDate.getMonth()}_${currentDate.getFullYear()}`;

        this.writeStream = fs.createWriteStream(`${dirName}/${this._target.replace('.', '_')}.txt`);
    }

    stop() {
        this.writeStream.end();
        this.process.kill('SIGINT');
    }
}

module.exports = Pinger;