
class Win {
    constructor() {
        this.win = null
    }
    sendData(event, data) {
        this.win.webContents.send(event, data)
    }
}

module.exports = Win