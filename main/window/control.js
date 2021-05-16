const Win = require('./Win')
const { BrowserWindow, screen } = require('electron')


class Control extends Win{
    constructor() {
        super()
        this.win = null
    }
    init() {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize
        this.win = new BrowserWindow({
            title: '主页面',
            width: width/2, 
            height: 750,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        })
        this.win.loadURL(`http://127.0.0.1:9999/control.html`)
        this.win.webContents.openDevTools()
    }
}

module.exports = new Control()

