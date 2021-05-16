const Win = require('./Win')
const { BrowserWindow } = require('electron')


class Home extends Win{
    constructor() {
        super()
        this.win = null
    }
    init() {
        this.win = new BrowserWindow({
            title: '主页面',
            width: 800, 
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        })
        this.win.loadURL(`http://127.0.0.1:9999/home.html`)
        this.win.webContents.openDevTools()
    }
    hide() {
        this.win.hide()
    }
}

module.exports = new Home()