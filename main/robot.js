const robot = require('robotjs')
const { ipcMain } = require('electron')
const vkey = require('vkey')

class Robot{
    constructor() {

    }
    /**
     * 处理鼠标事件
     * @param {object} data 
     */
    handleMouseEvent(data) {
        let {clientX, clientY, screen, video} = data
        let x = clientX * screen.width / video.width
        let y = clientY * screen.height / video.height
        robot.moveMouse(x, y)
        robot.mouseClick()
    }
    /**
     * 处理键盘事件
     * @param {object} data 
     */
    handleKeyEvent(data) {
        // data {keyCode, meta, alt, ctrl, shift}
        const modifiers = []
        if(data.meta) modifiers.push('meta')
        if(data.shift) modifiers.push('shift')
        if(data.alt) modifiers.push('alt')
        if(data.ctrl) modifiers.push('ctrl')
        let key = vkey[data.keyCode].toLowerCase()
        if(key[0] !== '<') { //<shift>
            robot.keyTap(key, modifiers)
        }
    }
    handle(data) {
        var {type, data} = data
        if(type == 'mouse') {
            this.handleMouseEvent(data)
        }else if(type == 'key') {
            this.handleKeyEvent(data)
        }
    }

}

module.exports = new Robot()
