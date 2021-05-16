<template>
    <div class="container">
        <div class="text">{{promptText}}</div>
        <div class="control" v-show="status != 2">
            <input type="text" v-model="remoteCode">
            <button @click="check">远程控制</button>
        </div>
    </div>
</template>
<script>
const { ipcRenderer } =  require('electron')
import peer from './peer-puppet'
export default {
    data() {
        return {
            status: 0,  // 0->简单登录  1->正在控制被人 2 -> 正在被别人控制
            code: '',
            remoteCode: '',
        }
    },
    computed: {
        promptText() {
            if(this.status == 2) {
                return `正在被 ${this.remoteCode} 控制`
            }else if(this.status == 1) {
                return `正在控制 ${this.remoteCode} 的电脑`
            }else{
                return `我的验证码是 ${this.code}`
            }
        }
    },
    created() {
        // 进入页面登录，获取本机控制码
        ipcRenderer.send('login')
        ipcRenderer.on('logined', (e, code)=>{
            this.code = code
        })
        this.initRtc() 
    },
    methods: {
        initRtc() {
            // 被对方控制
            ipcRenderer.on('control', async function(e, offer) {
                // 设置对方发送过来的offer
                var answer = await peer.createAnswer(offer)
                // 响应对方answer
                ipcRenderer.send('answer', answer)
                // 发送candidate给对方
                peer.getCandidate().then((candidate)=>{
                    ipcRenderer.send('control-candidate', candidate)
                })
            })
            // 接收设置对方发来的candidate
            ipcRenderer.on('puppet-candidate', (event, remoteCode, candidate)=>{
                this.remoteCode = remoteCode
                this.status = 2
                peer.setCandidate(candidate)
            })
        },
        check() {
            if(!/[0-9]+/.test(this.remoteCode)){
                alert('请输入正确的纯数字控制码头')
            }
            ipcRenderer.send('check', +this.remoteCode)
            ipcRenderer.on('checked', (event)=>{
                this.status = 1;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .container {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #EEE;
        .text {
            text-align: center;
        }
        .control {
            text-align: center;
        }
    }
</style>