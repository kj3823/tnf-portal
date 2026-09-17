const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true
        }
    });

    win.loadFile(
        path.join(__dirname, "../dist/index.html")
    );

    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);