const WebSocket = require('ws')
const WSThread = require('./WSThread')
const wss = new WebSocket.Server({port: 5000})

wss.on('connection', function connection(ws){
    const wsThread = new WSThread(ws)
    wsThread.init()
})

console.log('service start in ws://127.0.0.1:5000')