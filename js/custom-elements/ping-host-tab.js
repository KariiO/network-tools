let tmpl = document.createElement('template');
tmpl.innerHTML = `
<style>
    :host {
        display: none;
        height: 100vh;
        color: white;
        background: #6FD6A6;
    } 
    
    :host([active]) {
        display: block;
    }
</style>
this is ping host tab
`;

class PingHostTab extends HTMLElement {
    constructor() {
        super();

        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }
}

module.exports = {
    PingHostPage: PingHostTab
};
