const {EventEmitter} = require('events');
const readline = require('readline');
const {spawn} = require('child_process');

class TraceRouteCommand extends EventEmitter {
    constructor(command, args) {
        super();

        this.command = command;
        this.args = args;
        this.process = null;
    }

    run() {
        this.process = spawn(this.command, this.args);
        this.process.on('close', (code) => {
            this.emit('close', code);
        });

        readline.createInterface({
            input: this.process.stdout,
            terminal: false
        }).on('line', data => {
            const hopRegEx = /(?<rtt1>\*|<?[0-9]+ ms)(?:[ ]+)(?<rtt2>\*|<?[0-9]+ ms)(?:[ ]+)(?<rtt3>\*|<?[0-9]+ ms)  (?<hostname>[0-9a-z\-.]+)(?: \[(?<ip>[0-9a-z\-.]+)\])?/;
            const extractedData = data.match(hopRegEx);

            this.emit('hop', {
                originalOutput: data,
                jsonOutput: extractedData ? extractedData.groups : null
            });
        });
    }
}

module.exports = {
    TraceRouteCommand
};
