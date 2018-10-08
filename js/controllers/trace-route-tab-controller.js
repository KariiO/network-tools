const TracertHandler = require('../tracert-handler');

const traceRouteResultsEl = document.getElementById("trace-route-results");
const traceTargetNameEl = document.getElementById("trace-target-name");
const traceStopEl = document.getElementById("trace-route-stop");
const traceStartEl = document.getElementById("trace-route-start");

new TracertHandler(traceStartEl, traceStopEl, traceTargetNameEl, traceRouteResultsEl);
