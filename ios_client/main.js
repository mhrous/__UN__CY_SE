const { app, BrowserWindow } = require("electron");
const path = require("path");

require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron")
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow.maximize();
    mainWindow.show();
    mainWindow.autoHideMenuBar = true;
    mainWindow.loadFile("index.html");

    mainWindow.on("closed", function() {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
    if (mainWindow === null) createWindow();
});
