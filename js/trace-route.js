const toastr = require('../node_modules/toastr/toastr');
const Traceroute = require('./tracert');

let tracer;
const traceRouteResultsEl = document.getElementById("trace-route-results");
const traceTargetNameEl = document.getElementById("trace-target-name");
const traceStopEl = document.getElementById("trace-route-stop");
const traceStartEl = document.getElementById("trace-route-start");

traceStopEl.addEventListener("click", (e) => {
    e.preventDefault();

    tracer.stop();

    traceTargetNameEl.removeAttribute('disabled');
    traceStartEl.removeAttribute('disabled');
    traceStopEl.setAttribute('disabled', 'disabled');
});


traceStartEl.addEventListener("click", (e) => {
    e.preventDefault();
    tracer = new Traceroute();
    traceTargetNameEl.setAttribute('disabled', 'disabled');
    traceStartEl.setAttribute('disabled', 'disabled');
    traceStopEl.removeAttribute('disabled');

    const targetName = traceTargetNameEl.value;

    removePreviousResults();

    try {
        tracer
            .on('pid', (pid) => {
                console.log(`pid: ${pid}`);
            })
            .on('destination', (destination) => {
                console.log(`destination: ${destination}`);
            })
            .on('hop', (hop) => {
                traceRouteResultsEl.appendChild(generateHoopElement(hop));
                console.log(`hop: ${JSON.stringify(hop)}`);
            })
            .on('close', (code) => {
                console.log(`close: code ${code}`);

                if (code === null) {
                    toastr.warning(`Trace route to <b>${targetName}</b> stopped!`)

                } else {
                    toastr.info(`Trace route to <b>${targetName}</b> just finished!`)
                    traceTargetNameEl.removeAttribute('disabled');
                    traceStartEl.removeAttribute('disabled');
                    traceStopEl.setAttribute('disabled', 'disabled');

                }
            });

        console.log(targetName);
        tracer.trace(targetName);
    } catch (ex) {
        console.log(ex);
    }
});


function removePreviousResults() {
    const traceRouteResultsEl = document.getElementById("trace-route-results");
    let child;
    while ((child = traceRouteResultsEl.firstChild)) {
        traceRouteResultsEl.removeChild(child);
    }
}

function generateHoopElement(hopData) {
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

    trEl.appendChild(thIdEl);
    trEl.appendChild(tdIpEl);
    trEl.appendChild(tdRtt1El);
    trEl.appendChild(tdRtt2El);
    trEl.appendChild(tdRtt3El);

    return trEl;
}
