const {app, BrowserWindow} = require('electron');
// const devtron = require('devtron');
let win;

function createWindow() {
    // Devtron plugin - remove or add if statement only for debug version
    // devtron.install();

    win = new BrowserWindow({width: 1400, height: 700});

    win.loadFile('index.html');

    // win.webContents.openDevTools({mode: "undocked"});

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});
