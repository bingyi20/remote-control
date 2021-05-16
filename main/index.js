const { app } = require('electron')
const ipc = require('./ipc')
const home = require('./window/home')
require('./robot')

app.on('ready', ()=> {
    home.init()
})