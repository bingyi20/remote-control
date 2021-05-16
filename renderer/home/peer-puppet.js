import { EventEmitter } from 'events'
import { desktopCapturer, ipcRenderer } from 'electron'


class Peer extends EventEmitter{
    constructor() {
        super()
        this.pc = new window.RTCPeerConnection()
        this.initDatachannel()
    }
    getCandidate() {
        return new Promise((resolve)=>{
            this.pc.onicecandidate = (e) => {
                resolve(JSON.parse(JSON.stringify(e.candidate)))
            }
        })
    }
    initDatachannel() {
        this.pc.ondatachannel = (e)=>{
            console.log('datachannel', e)
            e.channel.onmessage = (e) => {
                let {type, data} = JSON.parse(e.data)
                ipcRenderer.send('robot', type, data)
            }
        }
    }
    /**
     * 接收offer,设置answer
     * @param {Object} offer 
     * @returns 
     */
    async createAnswer(offer) {
        const stream = await this.getScreen()
        console.log(stream)
        this.pc.addStream(stream)
        await this.pc.setRemoteDescription(offer)
        const answer = await this.pc.createAnswer()
        await this.pc.setLocalDescription(answer)
        return JSON.parse(JSON.stringify(this.pc.localDescription))
    }

    /**
     * 设置candidate
     */
     async setCandidate(candidate) {
        if(this.pc.remoteDescription && this.pc.remoteDescription.type) {
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
    }

    /**
     * 获取桌面流
     * @returns 
     */
    async getScreen() {
        const sources = await desktopCapturer.getSources({types: ['screen']})
        return new Promise((resolve) => {
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sources[0].id,
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height
                    }
                }
            }).then((stream) => {
                resolve(stream)
            }).catch(e => {
                console.log('屏幕捕获失败')
                console.error(e)
            })
        })
    }
}

const peer = new Peer()
window.peer = peer

export default peer


