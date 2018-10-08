const toastr = require('../node_modules/toastr/toastr');
const Tracert = require('./tracert');
const {initPingerHandler} = require("./controllers/ping-tab-controller");

class TracertHandler {
    constructor(traceStartButtonElement, traceStopButtonElement, traceTargetNameEl, traceRouteResultsEl) {
        this.executor = new Tracert();

        this.tpStartButtonElement = traceStartButtonElement;
        this.tpStopButtonElement = traceStopButtonElement;
        this.traceTargetNameEl = traceTargetNameEl;
        this.traceRouteResultsEl = traceRouteResultsEl;

        this.targetName = null;

        this.tpStartButtonElement.addEventListener('click', (e) => this.onStartButtonClick(e));
        this.tpStopButtonElement.addEventListener('click', (e) => this.onStopButtonClick(e));

        this.assignEventListeners();
    }

    assignEventListeners() {
        this.executor
            .on('pid', (pid) => {
                console.log(`pid: ${pid}`);
            })
            .on('destination', (destination) => {
                console.log(`destination: ${destination}`);
            })
            .on('hop', (hop) => {
                console.log(`hop: ${JSON.stringify(hop)}`);

                if (this.traceTargetNameEl.childElementCount > 10) {
                    this.traceTargetNameEl.removeChild(this.traceTargetNameEl.firstChild);
                }

                this.traceRouteResultsEl.appendChild(this.generateHoopElement(hop));
            })
            .on('close', (code) => {
                console.log(`close: code ${code}`);

                if (code === null) {
                    toastr.warning(`Trace route to <b>${this.targetName}</b> stopped!`)

                } else {
                    toastr.info(`Trace route to <b>${this.targetName}</b> just finished!`);
                    this.enableFormElements();

                }
            });
    }

    generateHoopElement(hopData) {
        const trEl = document.createElement('tr');

        const thIdEl = document.createElement('th');
        thIdEl.setAttribute('scope', 'row');
        thIdEl.innerText = hopData.hop;

        const tdIpEl = document.createElement('td');
        tdIpEl.innerText = hopData.ip;

        const tdRtt1El = document.createElement('td');
        tdRtt1El.innerText = hopData.rtt1;

        const tdRtt2El = document.createElement('td');
        tdRtt2El.innerText = hopData.rtt2;

        const tdRtt3El = document.createElement('td');
        tdRtt3El.innerText = hopData.rtt3;

        const tdActionsEl = document.createElement('td');
        const startPingEl = document.createElement('button');
        startPingEl.setAttribute('class', 'btn btn-success');
        startPingEl.innerText = 'PING IT';
        startPingEl.addEventListener('click', (e) => {
            e.preventDefault();

            initPingerHandler(hopData.ip, hopData.ip, true);
        });

        tdActionsEl.appendChild(startPingEl);

        trEl.appendChild(thIdEl);
        trEl.appendChild(tdIpEl);
        trEl.appendChild(tdRtt1El);
        trEl.appendChild(tdRtt2El);
        trEl.appendChild(tdRtt3El);
        trEl.appendChild(tdActionsEl);

        return trEl;
    }

    removePreviousResults() {
        let child;
        while ((child = this.traceRouteResultsEl.firstChild)) {
            this.traceRouteResultsEl.removeChild(child);
        }
    }

    enableFormElements() {
        this.traceTargetNameEl.disabled = false;
        this.tpStartButtonElement.disabled = false;
        this.tpStopButtonElement.disabled = true;
    }

    disableFormElements() {
        this.traceTargetNameEl.disabled = true;
        this.tpStartButtonElement.disabled = true;
        this.tpStopButtonElement.disabled = false;
    }

    onStartButtonClick(event) {
        event.preventDefault();

        this.removePreviousResults();
        this.targetName = this.traceTargetNameEl.value;
        this.executor.trace(this.targetName);

        this.disableFormElements();
    }

    onStopButtonClick(event) {
        event.preventDefault();

        this.executor.stop();

        this.enableFormElements();
    }
}

module.exports = TracertHandler;