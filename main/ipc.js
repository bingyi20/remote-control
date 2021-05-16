const { ipcMain } = require('electron')
const home = require('./window/home')
const control = require('./window/control')
const Signal = require('./Signal')
const robot = require('./robot')
const signal = new Signal()

let selfCode = ''
let remoteCode = ''

/**
 * 推流测试
 */
ipcMain.on('push-stream', (event, stream) => {
    console.log(stream)
})
/**
 * 发送登录请求
 */
ipcMain.on('login', (event)=>{
    signal.login().then(code => {
        selfCode = code
        event.reply('logined', code)
    })
})
/**
 * 「控制端」检测对方是否在线
 */
ipcMain.on('check', (event, code)=>{
    signal.check(code).then(()=>{
        console.log('对方在线, 开始尝试连接')
        home.sendData('checked')
        home.hide()
        remoteCode = code
        control.init()
    })
})

/**
 * 「控制端」请求控制对方,并发送offer信息
 */
ipcMain.on('control', (event, offer)=>{
    signal.sendMessage(remoteCode, 'control', {code: selfCode, offer})
})

/**
 * 「傀儡端」应答对方answer
 */
ipcMain.on('answer', (event, answer)=>{
    signal.sendMessage(remoteCode, 'answer', {code: selfCode, answer})
})

/**
 * 「控制端」发送candidate
 */
ipcMain.on('puppet-candidate', (event, candidate)=>{
    signal.sendMessage(remoteCode, 'puppet-candidate', {code: selfCode, candidate})
})

/**
 * 「傀儡端」发送candidate
 */
ipcMain.on('control-candidate', (event, candidate)=>{
    signal.sendMessage(remoteCode, 'control-candidate', {code: selfCode, candidate})
})

/**
 * 「控制端」发送robot控制事件
 */
// ipcMain.on('robot', (event, type, data)=>{
//     signal.sendMessage(remoteCode, 'robot', {type, data})
// })

// 「傀儡端」响应robot事件
ipcMain.on('robot', (event, type, data)=>{
    robot.handle({type, data})
})

/**
 * 「傀儡端」监听对方发送的控制请求
 */
signal.on('control', (data)=>{
    console.log('收到控制请求')
    const {code, offer} = data
    remoteCode = code
    home.sendData('control', offer)
})

/**
 * 「控制端」收到对方的answer应答
 */
signal.on('answer', (data)=>{
    const { answer } = data
    control.sendData('answer', answer)
})

/**
 * 「傀儡端」接收candidate
 */
signal.on('puppet-candidate', (data)=>{
    console.log('傀儡端收到candiadate')
    const { candidate } = data
    home.sendData('puppet-candidate', remoteCode, candidate)
})

/**
 * 「控制端」接收candidate
 */
 signal.on('control-candidate', (data)=>{
    const {candidate} = data
    control.sendData('control-candidate', candidate)
})

/**
 * 「傀儡端」本地响应robot事件
 */
// signal.on('robot', (data)=>{
//     robot.handle(data)
// })






