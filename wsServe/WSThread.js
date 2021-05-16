let id = 0;
let code2ws = new Map()
class WSThread {
    constructor(ws) {
        this.id = ++id;
        this.code = this.id;
        this.ws = ws
    }
    /**
     * 初始化
     */
    init() {
        this.ws.on('message', (message)=> {
            let parseData = JSON.parse(message)
            let {event, data, code = null} = parseData
            console.log(this.code, '==>', code, ': ',  message)
            if(event == 'login') {
                this.login()
            }else if(event == "check") {
                this.checkRemote(code)
            }else if(event == 'forward') {
                this.forward(data, code)
            }
        })
    }
    /**
     * 发送数据
     * @param {string} event 事件名
     * @param {object} data 数据
     */
    sendData(event, data = null) {
        this.ws.send(JSON.stringify({event, data}))
    }
    /**
     * 登录，生成code并返回
     */
    login() {
        let code = this.id
        code2ws.set(code, this)
        this.sendData('logined', code)
    }
    /**
     * 检测对方是否在线
     * @param {string} code 
     * @returns 
     */
    checkRemote(code) {
        if(!code2ws.has(code)) {
            return this.sendData('checked', {code: -1, msg: '对方不在线'})
        }
        this.sendData('checked', {code: 0, msg: '对方在线，可以远程'})
    }
    /**
     * 转发数据
     * @param {object} data 转发数据
     * @param {number} code 对方code码
     */
    forward(data, code) {
        code2ws.get(code).sendData(data.event, data.data)
    } 
}

module.exports = WSThread