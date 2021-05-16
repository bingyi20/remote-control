<template>
    <div id="video-wrapper">
        <video id="screen-video" ref="controlVideo" />
    </div>
</template>
<script>
import peer from './peer-control'  
import { ipcRenderer } from 'electron'
export default {
    data() {
        return {
            remoteCode: ''
        }
    },
    created() {
        window['control'] = this
        
        this.initRobot()
    },
    mounted() {
        this.initRtc()
        this.initRobot()
    },
    methods: {
        async initRtc() {
            const offer = await peer.init()
            peer.on('add-stream', (stream)=>{
                console.log('收到数据傀儡方传输的视频流')
                this.play(stream)
            })
            // 发送offer给对方
            ipcRenderer.send('control', offer)
            // 发送candidate给对方
            peer.getCandidate().then((candidate)=>{
                ipcRenderer.send('puppet-candidate', candidate)
            })
            // 设置对方响应的answer
            ipcRenderer.on('answer', (e, answer)=>{
                console.log('收到傀儡方的answer')
                peer.setRemote(answer)
            })
            // 接收candidate，设置candidate
            ipcRenderer.on('control-candidate', (e, candidate)=>{
                peer.setCandidate(candidate)
            })
        },    
        initRobot() {
            const videoWrapper = document.getElementById('video-wrapper')
            const screenVideo = this.$refs.controlVideo
            // 绑定鼠标事件
            window.onclick = (event) => {
                const e = event || window.event
                let {clientX, clientY} = e
                clientY += videoWrapper.scrollTop
                let screenW = screenVideo.videoWidth
                let screenH = screenVideo.videoHeight
                let videoW = parseFloat(getComputedStyle(screenVideo).width)
                let videoH = parseFloat(getComputedStyle(screenVideo).height)
                peer.emit('robot', 'mouse', {
                    clientX,
                    clientY,
                    screen: {
                        width: screenW,
                        height: screenH
                    },
                    video: {
                        width: videoW,
                        height: videoH
                    }
                })
            }
            // 绑定键盘事件
            window.onkeydown = (e) => {
                let data = {
                    keyCode: e.keyCode,
                    shift: e.shiftKey,
                    meta: e.meta,
                    control: e.control,
                    alt: e.alt
                }
                peer.emit('robot', 'key', data)
            }
        },
        play(stream) {
            const video = this.$refs.controlVideo
            video.srcObject = stream
            video.onloadedmetadata = (e) => video.play()
        }
    }
}
</script>
<style lang="scss" scoped>
#video-wrapper{
    position: absolute;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    video{
        width: 100%;
    }
}
</style>
