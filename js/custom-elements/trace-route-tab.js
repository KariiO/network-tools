const {TraceRouteCommand} = require('./../commands/trace-route-command');

let tmpl = document.createElement('template');
tmpl.innerHTML = `
<style>
    @import './css/checkbox.css';

    :host {
        display: none;
        height: 100vh;
    } 
    
    :host([active]) {
        display: block;
    }
    
    .wrapper {
        display: grid;
        grid-template-areas: "results form";
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 100vh;
    }
    
    .results {
        grid-area: results;
        padding: 0 1em;
    }
    
    .form {
        grid-area: form;
        padding: 0 1em;
    }
    
    .text-control {
        width: 100%;
        color: #333;
        padding: 7px 15px;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 15px;
        outline: none;
        margin-bottom: 12px;
        box-sizing: border-box; /* TODO: Investigate why this styles doesn't work from main.css */
    }
    
    table {
        width: 100%;
    }
    
    table, th, td {
        border-collapse: collapse;
        border:0;
        color: #F4F4F4
    }
    
    td {
        background: #292929;
        padding-top: 16px;
        padding-bottom: 16px;
        color: gray;
        font-size: 15px;
        line-height: 1.4;
        text-align: center;
    }
    
    th {
        font-size: 15px;
        color: #DB5461;
        line-height: 1.4;
        text-transform: uppercase;
        background-color: #1f1f1f;
        padding-top: 18px;
        padding-bottom: 18px;
    }
    
    td:first-child, th:first-child {
         border-left: none;
    }

    
</style>
<div class="wrapper">
    <div class="results">
        <table id="output">
            <thead>
                <tr>
                    <th>RTT1</th>
                    <th>RTT2</th>
                    <th>RTT3</th>
                    <th>HOSTNAME</th>
                    <th>IP</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="form">
        <form>
            <label for="target-name">Target name</label>
            <input class="text-control" id="target-name">
            
            <label for="max-hops-number">Maximum number of hops to search for target</label>
            <input class="text-control" id="max-hops-number">  
                      
            <label for="timeout-ms">Wait timeout milliseconds for each reply</label>
            <input class="text-control" id="timeout-ms">     
                      
            <label for="loose-source-route">Loose source route along host-list (IPv4-only)</label>
            <input class="text-control" id="loose-source-route">  
                                
            <label for="trace-round-trip">Trace round-trip path (IPv6-only)</label>
            <input class="text-control" id="trace-round-trip">
                                
            <label for="use-source-address">Source address to use (IPv6-only)</label>
            <input class="text-control" id="use-source-address">
            
            <label class="container">
                Do not resolve addresses to hostnames
              <input type="checkbox" id="not-resolve-addresses">
              <span class="checkmark"></span>
            </label>
            
            <label class="container">
                Force using IPv4
              <input type="checkbox" id="use-ip-v4">
              <span class="checkmark"></span>
            </label>
            
            <label class="container">
                Force using IPv6
              <input type="checkbox" id="use-ip-v6">
              <span class="checkmark"></span>
            </label>
            
            <button id="run-btn">Run</button>
        </form>
    </div>
</div>
`;

class TraceRouteTab extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

        this.attachEventListeners();
    }

    attachEventListeners() {
        const runEl = this._shadowRoot.querySelector('#run-btn');

        runEl.addEventListener('click', e => {
            e.preventDefault();

            const traceRouteCommand = new TraceRouteCommand('tracert', ['8.8.8.8']);

            traceRouteCommand.on('hop', this.handleOnHopData.bind(this));
            traceRouteCommand.on('close', console.log);

            traceRouteCommand.run();
        });
    }

    /**
     * Returns a coordinate from a given mouse or touch event
     * @param {Object} data
     * @param {Object|null} data.jsonOutput
     * @param {string} data.jsonOutput.rtt1
     * @param {string} data.jsonOutput.rtt2
     * @param {string} data.jsonOutput.rtt3
     * @param {string} data.jsonOutput.hostname
     * @param {string} data.jsonOutput.ip
     * @param {string} data.originalOutput
     */
    handleOnHopData(data) {
        const tableEl = this._shadowRoot.querySelector('#output tbody');
        console.log(data);

        if (data.jsonOutput) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <td>${data.jsonOutput.rtt1}</td>
                    <td>${data.jsonOutput.rtt2}</td>
                    <td>${data.jsonOutput.rtt3}</td>
                    <td>${data.jsonOutput.hostname}</td>
                    <td>${data.jsonOutput.ip}</td>
                    `;

            tableEl.appendChild(tr);
        } else if (data.originalOutput.length) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5">${data.originalOutput}</td>`;

            tableEl.appendChild(tr);
        }
    }
}

module.exports = {
    TraceRoutePage: TraceRouteTab
};
