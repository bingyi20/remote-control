const WebSocket = require('ws')
const { EventEmitter } = require('events')

class Signal extends EventEmitter{
    constructor() {
        super()
        this.ws = new WebSocket('ws://127.0.0.1:5000')
        this.init()
    }
    /**
     * 初始化ws连接
     */
    init() {
        this.ws.on('open', function(open){
            console.log('connect ws serve success.')
        })
        this.ws.on('message', (message)=>{
            const data = JSON.parse(message)
            // const {event, data} = data
            // if(event == 'logined') {
            //     this.emit('logined', data)
            // }else if(event == 'checked') {
            //     this.emit('checked', data)
            // }
            this.emit(data.event, data.data)
        })
    }
    /**
     * 登录
     * @returns promise 
     */
    login() {
        this.ws.send(JSON.stringify({event: 'login'}))
        return new Promise((resolve, reject)=>{
            this.once('logined', (code)=>{
                resolve(code)
            })
            // 5s连接不上登录失败
            setTimeout(()=>{
                reject('登录失败')
            }, 5000)
        })
    }
    /**
     * 通过code检测对方是否在线
     * @param {number} code 
     * @returns 
     */
    check(code) {
        this.ws.send(JSON.stringify({event: 'check', code}))
        return new Promise((resolve, reject)=>{
            this.once('checked', (data)=>{
                if(data.code == 0) {
                    resolve()
                }else {
                    reject(data.msg)
                }
            })
        })
    }
    /**
     * 发送消息
     * @param {number} code 对方code
     * @param {事件名} event 
     * @param {数据} data 
     */
    sendMessage(code, event, data) {
        let params = {
            code,
            event: 'forward',
            data: {
                event,
                data
            }
        }
        this.ws.send(JSON.stringify(params))
    }
}

module.exports = Signal