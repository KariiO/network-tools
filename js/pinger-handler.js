const Pinger = require('./pinger');

class PingerHandler {
    constructor(tabHeaderText, targetName, immediatelyStart) {
        this.executor = new Pinger();

        this.id = new Date().getTime();

        this.tpInputElement = null;
        this.tpStartButtonElement = null;
        this.tpStopButtonElement = null;
        this.tpResultsElement = null;

        this.targetName = targetName;
        this.immediatelyStart = immediatelyStart;

        this._tabElement = this.createTabElement(tabHeaderText);
        this._tabPanelElement = this.createTabPanelElement();

        this.assignEventListeners();

        if (this.targetName != null) {
            this.executor.target = targetName;
        }

        if (this.immediatelyStart === true) {
            this.disableFormElements();
            this.executor.start();
        }
    }

    get tabElement() {
        return this._tabElement;
    }

    get tabPanelElement() {
        return this._tabPanelElement;
    }

    assignEventListeners() {
        this.executor
            .on('pid', (pid) => {
                console.log(`pid: ${pid}`);
            })
            .on('ping', (line) => {
                console.log('ping', line);

                if (this.tpResultsElement.childElementCount > 10) {
                    this.tpResultsElement.removeChild(this.tpResultsElement.firstChild);
                }

                this.tpResultsElement.appendChild(this.generateResultElement(line));
            })
            .on('close', (code) => {
                console.log('close', code);
            });
    }

    generateResultElement(data) { // TODO: Refactor
        const trEl = document.createElement('tr');

        const tdElEl = document.createElement('td');
        tdElEl.innerText = data;

        trEl.appendChild(tdElEl);

        return trEl;
    }

    onStartButtonClick(event) {
        event.preventDefault();

        console.log('start button clicked!', this);

        this.executor.start();

        this.disableFormElements();
    }

    onStopButtonClick(event) {
        event.preventDefault();

        console.log('stop button clicked!', this);

        this.executor.stop();

        this.enableFormElements();
    }

    enableFormElements() {
        this.tpInputElement.disabled = false;
        this.tpStartButtonElement.disabled = false;
        this.tpStopButtonElement.disabled = true;
    }

    disableFormElements() {
        this.tpInputElement.disabled = true;
        this.tpStartButtonElement.disabled = true;
        this.tpStopButtonElement.disabled = false;
    }

    createTabElement(tabHeaderText) {
        const liEl = document.createElement('li');
        liEl.setAttribute('class', 'nav-item');

        const aEl = document.createElement('a');
        aEl.text = tabHeaderText;
        aEl.setAttribute('class', 'nav-link');
        aEl.setAttribute('id', `ping-tab-link-${this.id}`);
        aEl.setAttribute('data-toggle', 'tab');
        aEl.setAttribute('href', `#ping-tab-panel-${this.id}`);
        aEl.setAttribute('role', 'tab');
        aEl.setAttribute('aria-controls', 'home');
        aEl.setAttribute('aria-selected', 'false');

        liEl.appendChild(aEl);

        return liEl;
    }

    createTabPanelElement() {
        const panelEl = document.createElement('div');
        panelEl.setAttribute('class', 'tab-pane fade');
        panelEl.setAttribute('id', `ping-tab-panel-${this.id}`);
        panelEl.setAttribute('role', 'tabpanel');
        panelEl.setAttribute('aria-labelledby', `ping-tab-link-${this.id}`);

        const formEl = document.createElement('form');
        formEl.setAttribute('class', 'form-inline mb-2 mt-2');

        const divEl = document.createElement('div');
        divEl.setAttribute('class', 'form-group');

        this.tpInputElement = document.createElement('input');
        this.tpInputElement.setAttribute('class', 'form-control');
        this.tpInputElement.setAttribute('id', `ping-target-name-${this.id}`); // unique id needed
        this.tpInputElement.setAttribute('placeholder', 'Target name');

        if (this.targetName != null) {
            this.tpInputElement.value = this.targetName;
        }

        divEl.appendChild(this.tpInputElement);

        this.tpStartButtonElement = document.createElement('button');
        this.tpStartButtonElement.setAttribute('type', 'submit');
        this.tpStartButtonElement.setAttribute('class', 'btn btn-primary ml-2');
        this.tpStartButtonElement.setAttribute('id', `ping-start-${this.id}`); // unique id needed
        this.tpStartButtonElement.innerText = 'Run';

        this.tpStartButtonElement.addEventListener('click', (e) => this.onStartButtonClick(e));

        this.tpStopButtonElement = document.createElement('button');
        this.tpStopButtonElement.setAttribute('class', 'btn btn-danger ml-2');
        this.tpStopButtonElement.setAttribute('id', `ping-stop-${this.id}`); // unique id needed
        this.tpStopButtonElement.disabled = true;
        this.tpStopButtonElement.innerText = 'Stop';

        this.tpStopButtonElement.addEventListener('click', (e) => this.onStopButtonClick(e));

        formEl.appendChild(divEl);
        formEl.appendChild(this.tpStartButtonElement);
        formEl.appendChild(this.tpStopButtonElement);

        const tableEl = document.createElement('table');
        tableEl.setAttribute('class', 'table table-hover');

        const theadEl = document.createElement('thead');
        theadEl.setAttribute('class', 'thead-dark');

        const trEl = document.createElement('tr');
        const thEl = document.createElement('th');
        thEl.setAttribute('scope', 'col');
        thEl.innerText = 'RESULTS';
        trEl.appendChild(thEl);

        this.tpResultsElement = document.createElement('tbody');
        this.tpResultsElement.setAttribute('id', `ping-results-${this.id}`);

        theadEl.appendChild(trEl);
        tableEl.appendChild(theadEl);
        tableEl.appendChild(this.tpResultsElement);

        panelEl.appendChild(formEl);
        panelEl.appendChild(tableEl);

        return panelEl;
    }
}

module.exports = PingerHandler;