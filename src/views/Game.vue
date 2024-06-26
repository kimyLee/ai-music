<template>
  <div class="main">
    <div class="main-box">
      <!-- 第一排功能按键 -->
      <div class="menu-box">
        <div class="m-btn btn-ai">Z</div>
        <!-- screen field -->
        <Screen :current="currentStep" :text="score" :status="status" />
        <!-- 功能键 -->
        <div class="m-btn" @click="handleCancel">Cancel</div>
        <!-- 扬声器位置示意 -->
        <div class="btn-micro" @click="handleStart"></div>
      </div>
      <!-- 第二排开始，3*7的键盘布局 -->
      <div class="test-block-box">
        <div class="block" @click="handleClick(0)"></div>
        <div class="block" @click="handleClick(1)"></div>
        <div class="block" @click="handleClick(2)"></div>
      </div>
      <Keyboard
        ref="keyboard"
        @changeStep="changeStep"
        @changeStatus="changeStatus"
        @changeRightNum="changeRightNum"
      />
    </div>
  </div>
</template>

<script lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import Keyboard from '@/components/keyboard/Layout.vue'
import Screen from '@/components/Screen.vue'
// import Droparea from '@/components/Droparea'
import { Midi } from '@tonejs/midi'
import { defineComponent } from 'vue'
import * as Tone from 'tone'

let midi: any
let mySampler: any

export default defineComponent({
  name: 'game',
  data() {
    return {
      message: 'Hello!',
      stageSize: '',
      status: 'Normal',
      currentStep: 0,
      rightNumber: 0,
      totalStep: 4,
      // 别踩白块
      gameArr: [] as any,
      gameOver: false,
      firstClick: true,
      samplerLoaded: false,
      score: 0,
      currentNote: 0,
      gameTimer: null as any,
      notes: [] as any[],
      gameTime: 30
    }
  },
  components: {
    Keyboard,
    Screen
  },
  computed: {},
  mounted() {
    this.initGameArr()
    this.initTone()
    this.drawLight()
    // 1. 随机生成0-2函数，初始化长度为7的数组
    // 2. 实现位移函数，arr整体偏移，且arr push 新随机数
    // 3. 实现整体绘制函数，根据arr，绘制当前屏幕的灯
    // 4. 实现点击事件：错误则gameOver，显示分数，cancel重新开始
    // 5. 正确则出发位移函数
    // 6: 实现tone 播放音符函数
    // 7. 正确同时播放音符
  },
  methods: {
    // 音乐相关
    startCountDown() {
      clearTimeout(this.gameTimer)
      this.gameTime = 30
      this.handleCountDown()
    },
    handleCountDown() {
      setTimeout(() => {
        this.gameTime--
        this.changeStatus('剩余' + this.gameTime + 's')
        if (this.gameTime <= 0) {
          this.gameOver = true
        } else {
          this.handleCountDown()
        }
      }, 1000)
    },
    async initTone() {
      // let midi = await Midi.fromUrl('/ai-music/dist/moon.mid')
      let midi = await Midi.fromUrl('/ai-music/dist/3.mid')
      midi.tracks.forEach((track) => {
        console.log(midi.tracks.length, 'midi.tracks')
        track.notes.forEach((note) => {
          console.log('note: ', note.name, note.duration, note.time)
          this.notes.push({ name: note.name, duration: note.duration, time: note.time + 1 })
          // synth1.triggerAttackRelease(note.name, note.duration, note.time)
        })
      })
      console.log(this.notes.length)

      await Tone.start()

      mySampler = new Tone.Sampler({
        urls: {
          A0: 'A0.mp3',
          C1: 'C1.mp3',
          'D#1': 'Ds1.mp3',
          'F#1': 'Fs1.mp3',
          A1: 'A1.mp3',
          C2: 'C2.mp3',
          'D#2': 'Ds2.mp3',
          'F#2': 'Fs2.mp3',
          A2: 'A2.mp3',
          C3: 'C3.mp3',
          'D#3': 'Ds3.mp3',
          'F#3': 'Fs3.mp3',
          A3: 'A3.mp3',
          C4: 'C4.mp3',
          'D#4': 'Ds4.mp3',
          'F#4': 'Fs4.mp3',
          A4: 'A4.mp3',
          C5: 'C5.mp3',
          'D#5': 'Ds5.mp3',
          'F#5': 'Fs5.mp3',
          A5: 'A5.mp3',
          C6: 'C6.mp3',
          'D#6': 'Ds6.mp3',
          'F#6': 'Fs6.mp3',
          A6: 'A6.mp3',
          C7: 'C7.mp3',
          'D#7': 'Ds7.mp3',
          'F#7': 'Fs7.mp3',
          A7: 'A7.mp3',
          C8: 'C8.mp3'
        },
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        onload: () => {
          this.samplerLoaded = true
          console.log('Sampler loaded')
        }
      }).toDestination()
    },
    playMusic() {
      if (!this.samplerLoaded) return
      const note = this.notes[this.currentNote]
      console.log(note.name, note.duration, note.time)
      const now = Tone.now()
      mySampler.triggerAttackRelease(note.name, note.duration, now)
      // mySampler.triggerAttackRelease(note.name, note.duration, now + note.time)
      // mySampler.triggerAttackRelease(note, '4n')
      this.currentNote = (this.currentNote + 1) % this.notes.length
    },
    generateRandom() {
      return Math.floor(Math.random() * 3)
    },
    initGameArr() {
      for (let i = 0; i < 7; i++) {
        this.gameArr.push(this.generateRandom())
      }
    },
    offsetArr() {
      for (let i = 0; i < 6; i++) {
        this.gameArr[i] = this.gameArr[i + 1]
      }
      this.gameArr[6] = this.generateRandom()
    },
    drawLight() {
      ;(this.$refs as any).keyboard.setAllLightOff()
      const indexMap = [
        [0, 7, 14],
        [1, 8, 15],
        [2, 9, 16],
        [3, 10, 17],
        [4, 11, 18],
        [5, 12, 19],
        [6, 13, 20]
      ]
      for (let i = 0; i < 7; i++) {
        const lineIndex = this.gameArr[i]

        for (let j = 0; j < 3; j++) {
          if (j != lineIndex) {
            const lightIndex = i + j * 7
            ;(this.$refs as any).keyboard.setIndexLightToggle(lightIndex, true)
          }
        }
      }
    },
    // 处理点击事件
    handleClick(index: number) {
      if (this.gameOver) {
        return
      }
      if (this.firstClick) {
        this.firstClick = false
        this.startCountDown()
      }
      if (this.gameArr[0] === index) {
        // 正确
        this.score++
        this.offsetArr()
        this.drawLight()
        this.playMusic()
      } else {
        this.gameOver = true
        this.status = 'Game Over'
      }
    },
    async handleStart() {},
    handleScore(index: number) {},
    handleLoop() {},
    closeLoop() {},

    // End music 相关
    handleCancel() {
      // this.closeLoop()
      location.reload()
      ;(this.$refs as any).keyboard.handleFinishAI()
    },
    changeStep(step: number) {
      this.currentStep = step
    },
    changeStatus(status: string) {
      this.status = status
    },
    changeRightNum(num: number) {
      this.rightNumber = num
    },
    handlePlayAI() {
      console.log('click')
      ;(this.$refs as any).keyboard.handlePlayAI()
    }
  }
})
</script>

<style scoped lang="scss">
.main {
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-box {
  position: relative;
  border: 2px solid #ccc;
  border-radius: 10px;
  max-width: 677px;
  max-height: 400px;
  padding: 10px;
  box-sizing: border-box;
}
.test-block-box {
  position: absolute;
  bottom: 10px;
  height: 283px;
  left: 14px;
  z-index: 100;

  display: flex;
  // width: 400px;
  // margin-top: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  .block {
    width: 89px;
    height: 89px;

    // margin: 5px;
    border: 2px solid #444;
    background-color: #fff;
    transition: background-color 0.8s ease;
  }
}

@media screen and (max-width: 1200px) {
  .main-box {
    width: 100%;
    height: 100%;
    max-width: 677px;
    max-height: 400px;
    transform: scale(0.9) translateY(10px);
  }
}
</style>
