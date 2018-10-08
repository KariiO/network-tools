const PingerHandler = require('../pinger-handler');

const addTabEl = document.getElementById("add-tab");
const tabNameEl = document.getElementById("tab-name");
const pingTabNavEl = document.getElementById("myTab");
const pingPanelEl = document.getElementById("myTabContent");
const nameAsTargetEl = document.getElementById('name-as-target');
const immediatelyStartEl = document.getElementById('immediately-start');

addTabEl.addEventListener("click", () => {
    const tabHeaderText = tabNameEl.value;
    const targetName = nameAsTargetEl.checked ? tabHeaderText : null;
    const immediatelyStart = immediatelyStartEl.checked;

    initPingerHandler(tabHeaderText, targetName, immediatelyStart);
});


function initPingerHandler(tabHeaderText, targetName, immediatelyStart) {
    const handler = new PingerHandler(tabHeaderText, targetName, immediatelyStart);

    pingTabNavEl.insertBefore(handler.tabElement, pingTabNavEl.children[pingTabNavEl.children.length - 1]);
    pingPanelEl.insertBefore(handler.tabPanelElement, pingPanelEl.children[pingPanelEl.children.length - 1]);
}

module.exports = {
    initPingerHandler
};