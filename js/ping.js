const toastr = require('../node_modules/toastr/toastr');
const Pinger = require('./pinger');

function generateResultElement(data) {
    const trEl = document.createElement('tr');

    const tdElEl = document.createElement('td');
    tdElEl.innerText = data;

    trEl.appendChild(tdElEl);

    return trEl;
}


const addTabEl = document.getElementById("add-tab");
const tabNameEl = document.getElementById("tab-name");
const pingTabNavEl = document.getElementById("myTab");
const pingPanelEl = document.getElementById("myTabContent");
let pingTabCounter = 0;

addTabEl.addEventListener("click", () => {
    addPingTab();
    addPingPanel();

    pingTabCounter++;
});


function addPingTab() {
    const liEl = document.createElement('li');
    liEl.setAttribute('class', 'nav-item');

    const aEl = document.createElement('a');
    aEl.text = tabNameEl.value;
    aEl.setAttribute('class', 'nav-link');
    aEl.setAttribute('id', `ping-tab-link-${pingTabCounter}`);
    aEl.setAttribute('data-toggle', 'tab');
    aEl.setAttribute('href', `#ping-tab-panel-${pingTabCounter}`);
    aEl.setAttribute('role', 'tab');
    aEl.setAttribute('aria-controls', 'home');
    aEl.setAttribute('aria-selected', 'false');

    liEl.appendChild(aEl);

    pingTabNavEl.insertBefore(liEl, pingTabNavEl.children[pingTabNavEl.children.length - 1]);
}

function addPingPanel() {
    const panelEl = document.createElement('div');
    panelEl.setAttribute('class', 'tab-pane fade');
    panelEl.setAttribute('id', `ping-tab-panel-${pingTabCounter}`);
    panelEl.setAttribute('role', 'tabpanel');
    panelEl.setAttribute('aria-labelledby', `ping-tab-link-${pingTabCounter}`);

    const formEl = document.createElement('form');
    formEl.setAttribute('class', 'form-inline mb-2 mt-2');

    const divEl = document.createElement('div');
    divEl.setAttribute('class', 'form-group');

    const inputEl = document.createElement('input');
    inputEl.setAttribute('class', 'form-control');
    inputEl.setAttribute('id', `ping-target-name-${pingTabCounter}`); // unique id needed
    inputEl.setAttribute('placeholder', 'Target name');

    const nameAsTargetEl = document.getElementById('name-as-target');
    if (nameAsTargetEl.checked) {
        inputEl.value = tabNameEl.value;
    }

    divEl.appendChild(inputEl);

    const button1El = document.createElement('button');
    button1El.setAttribute('type', 'submit');
    button1El.setAttribute('class', 'btn btn-primary ml-2');
    button1El.setAttribute('id', `ping-start-${pingTabCounter}`); // unique id needed
    button1El.innerText = 'Run';

    const button2El = document.createElement('button');
    button2El.setAttribute('class', 'btn btn-danger ml-2');
    button2El.setAttribute('id', `ping-stop-${pingTabCounter}`); // unique id needed
    button2El.disabled = true;
    button2El.innerText = 'Stop';

    formEl.appendChild(divEl);
    formEl.appendChild(button1El);
    formEl.appendChild(button2El);

    const tableEl = document.createElement('table');
    tableEl.setAttribute('class', 'table table-hover');

    const theadEl = document.createElement('thead');
    theadEl.setAttribute('class', 'thead-dark');

    const trEl = document.createElement('tr');
    const thEl = document.createElement('th');
    thEl.setAttribute('scope', 'col');
    thEl.innerText = 'RESULTS';
    trEl.appendChild(thEl);

    const tbodyEl = document.createElement('tbody');
    tbodyEl.setAttribute('id', `ping-results-${pingTabCounter}`);


    theadEl.appendChild(trEl);
    tableEl.appendChild(theadEl);
    tableEl.appendChild(tbodyEl);


    panelEl.appendChild(formEl);
    panelEl.appendChild(tableEl);
    pingPanelEl.insertBefore(panelEl, pingPanelEl.children[pingPanelEl.children.length - 1]);

    let pinger;

    button2El.addEventListener('click', (e) => {
        e.preventDefault();

        inputEl.removeAttribute('disabled');
        button1El.removeAttribute('disabled');
        button2El.setAttribute('disabled', 'disabled');
        pinger.stop();
    });

    const immediatelyStartEl = document.getElementById('immediately-start');
    if (immediatelyStartEl.checked) {
        console.log('here?');
        inputEl.setAttribute('disabled', 'disabled');
        button1El.setAttribute('disabled', 'disabled');
        button2El.removeAttribute('disabled');
        pinger = startPinging(inputEl.value, tbodyEl);
    }

    button1El.addEventListener('click', (e) => {
        e.preventDefault();

        inputEl.setAttribute('disabled', 'disabled');
        button1El.setAttribute('disabled', 'disabled');
        button2El.removeAttribute('disabled');
        pinger = startPinging(inputEl.value, tbodyEl);
    });

    pingTabCounter++;
}

function startPinging(targetName, resultsEl) {
    const pinger = new Pinger(targetName);
    try {
        pinger
            .on('pid', (pid) => {
                console.log(`pid: ${pid}`);
            })
            .on('ping', (line) => {
                console.log(targetName, line);

                if (resultsEl.childElementCount > 10) {
                    resultsEl.removeChild(resultsEl.firstChild);
                }

                resultsEl.appendChild(generateResultElement(line));
            })
            .on('close', (code) => {
                console.log(`close: code ${code}`);

                if (code === null) {
                    toastr.warning(`Pinging <b>${targetName}</b> stopped!`);

                } else {
                    toastr.info(`Pinging <b>${targetName}</b> just finished!`);
                    // pingTargetNameEl.removeAttribute('disabled');
                    // pingStartEl.removeAttribute('disabled');
                    // pingStopEl.setAttribute('disabled', 'disabled');
                }
            });

        console.log(targetName);
        pinger.start();
    } catch (ex) {
        console.log(ex);
    }

    return pinger;
}