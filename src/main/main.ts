import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    console.log('Loading index.html from:', path.join(__dirname, '../../public/index.html'));
    
    // und lade die index.html der App.
    mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));
    
    // Öffne die DevTools.
    mainWindow.webContents.openDevTools();
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
app.whenReady().then(() => {
    console.log('App is ready');
    createWindow();
});

// Beenden, wenn alle Fenster geschlossen sind.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});