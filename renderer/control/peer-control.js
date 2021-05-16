import { EventEmitter } from 'events'

class Peer extends EventEmitter{
    constructor() {
        super()
        this.candidate = null
        this.pc = new window.RTCPeerConnection()
        this.dc = this.pc.createDataChannel('robotchannel', {reliable: false})
    }
    getCandidate() {
        return new Promise((resolve)=>{
            this.pc.onicecandidate = (e) => {
                resolve(JSON.parse(JSON.stringify(e.candidate)))
            }
        })
    }
    async init() {
        this.pc.onaddstream = (e) => {
            this.emit('add-stream', e.stream)
        }
        this.dc.onopen = () => {
            this.on('robot', (type, data) => {
                this.dc.send(JSON.stringify({type, data}))
            })
        }
        this.dc.onmessage = (e) => {
            console.log('接收到channel消息')
            console.log(e)
        }
        this.dc.onerror = (e) => {
            console.error('channel连接异常')
            console.log(e)
        }
        this.dc.onmessage
        return await this.createOffer()
    }
    /**
     * 创建offer
     * @returns 本地offer
     */
    async createOffer() {
        const offer = await this.pc.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: true
        })
        await this.pc.setLocalDescription(offer)
        return JSON.parse(JSON.stringify(this.pc.localDescription))
    }
    /**
     * 设置远方offer
     * @param {Object} answer 
     */
    async setRemote(answer) {
        await this.pc.setRemoteDescription(answer)
    }
    /**
     * 设置candidate
     */
    async setCandidate(candidate) {
        if(this.pc.remoteDescription && this.pc.remoteDescription.type) {
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate))
        }else{
            setTimeout(()=>{
                this.setCandidate(candidate)
            }, 1000)
        }
    }
}


const peer = new Peer()
window.peer = peer

export default peer