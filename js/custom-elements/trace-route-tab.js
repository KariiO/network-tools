let tmpl = document.createElement('template');
tmpl.innerHTML = `
<style>
    :host {
        display: none;
        height: 100vh;
        color: white;
        background: #DB5461;
    } 
    
    :host([active]) {
        display: block;
    }
</style>
this is trace route tab
`;

class TraceRouteTab extends HTMLElement {
    constructor() {
        super();

        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }
}

module.exports = {
    TraceRoutePage: TraceRouteTab
};
