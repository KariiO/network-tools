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
    }
    
    .form {
        grid-area: form;
        padding: 0 2em;
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
</style>
<div class="wrapper">
    <div class="results">
        <table border="1" id="customers">
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
          </tr>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
          </tr>
          <tr>
            <td>Berglunds snabbköp</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
          </tr>
          <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
          </tr>
          <tr>
            <td>Ernst Handel</td>
            <td>Roland Mendel</td>
            <td>Austria</td>
          </tr>
          <tr>
            <td>Island Trading</td>
            <td>Helen Bennett</td>
            <td>UK</td>
          </tr>
          <tr>
            <td>Königlich Essen</td>
            <td>Philip Cramer</td>
            <td>Germany</td>
          </tr>
          <tr>
            <td>Laughing Bacchus Winecellars</td>
            <td>Yoshi Tannamuri</td>
            <td>Canada</td>
          </tr>
          <tr>
            <td>Magazzini Alimentari Riuniti</td>
            <td>Giovanni Rovelli</td>
            <td>Italy</td>
          </tr>
          <tr>
            <td>North/South</td>
            <td>Simon Crowther</td>
            <td>UK</td>
          </tr>
          <tr>
            <td>Paris spécialités</td>
            <td>Marie Bertrand</td>
            <td>France</td>
          </tr>
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

        this.attachEvents();
    }

    attachEvents() {
        const runEl = this._shadowRoot.querySelector('#run-btn');

        runEl.addEventListener('click', e => {
            e.preventDefault();

            const traceRouteCommand = new TraceRouteCommand('tracert', ['8.8.8.8']);

            traceRouteCommand.on('hop', console.log);
            traceRouteCommand.on('close', console.log);

            traceRouteCommand.run();
        });
    }
}

module.exports = {
    TraceRoutePage: TraceRouteTab
};
