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
        <div
          class="block"
          :class="{ perfect: isActive1, wrong: isWrong1, well: isWell1 }"
          @click="handleScore(1)"
        ></div>
        <div
          class="block"
          :class="{ perfect: isActive2, wrong: isWrong2, well: isWell2 }"
          @click="handleScore(2)"
        ></div>
        <div
          class="block"
          :class="{ perfect: isActive3, wrong: isWrong3, well: isWell3 }"
          @click="handleScore(3)"
        ></div>
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

export default defineComponent({
  name: 'Music',
  data() {
    return {
      message: 'Hello!',
      stageSize: '',
      status: 'Normal',
      currentStep: 0,
      rightNumber: 0,
      totalStep: 4,
      // 音乐掉落
      musicPlayer: null as any,
      data: {} as any,
      bpm: 100,
      beats: [] as any[],
      loopTime: 100, // delayTime / 6
      beatTime: 0,
      countDivideBeatFactor: 3,
      delayTime: 1200, // 假定值
      // loop
      lastUpdateTime: 0,
      startTime: 0,
      currentBeat: 0,
      count: 0,
      loopCurrentIndex: 0,
      timer: null as any,
      isActive1: false,
      isActive2: false,
      isActive3: false,
      isWell1: false,
      isWell2: false,
      isWell3: false,
      isWrong1: false,
      isWrong2: false,
      isWrong3: false,
      isActive1Time: 0,
      isActive2Time: 0,
      isActive3Time: 0,
      timer1: null as any,
      timer2: null as any,
      timer3: null as any,
      score: 0,
      canPlay: false
    }
  },
  components: {
    Keyboard,
    Screen
  },
  computed: {},
  mounted() {
    // this.musicPlayer = new Audio('/ai-music/dist/flowerdance.mp3')
    this.musicPlayer = new Audio('/ai-music/dist/zhongguohua.mp3')
    this.musicPlayer.addEventListener(
      'canplaythrough',
      () => {
        this.canPlay = true
      },
      false
    )
    this.getJson()
    // 1. ok 获取json文件对象
    // 2. ok 数据清洗，获取bpm，beat数组，其中beat数组1和2轨道合并去重
    // 3. ok 如果beat数组2有数值，表示偏移 500【2】/1000【3】距离差
    // 4. ok 设settimeout 间隔 loopTime = 200ms(6格位移1200ms), beatTime = 60000 / bpm = 600ms, countDivideBeatFactor = beatTime / loopTime
    // 5. ok 假定延时时间，大概1200ms
    // 5. 建立循环体，x=200ms,执行一次；生成currentBeat: beats = Math.floor(count / (countDivideBeatFactor=3)), if (current!=beats) ```
    // 6: 每次循环执行逻辑：1. 提前点灯：for循环beats，如果beat - currentbeat <= 2, index = beat * 3 - count)
    // 7. 如果beat < currentbeat跳过，如果beat - currentbeat > 2, 结束循环,
    // 8.
    // 9. 点击正确亮灯逻辑，绿灯和红灯
    // 10. 正确计分逻辑
  },
  methods: {
    // 音乐相关
    async getJson() {
      // let obj = {} as any
      var oReq = new XMLHttpRequest()
      // oReq.open('GET', '/ai-music/dist/1.json', true)
      oReq.open('GET', '/ai-music/dist/2.json', true)

      oReq.onload = (oEvent) => {
        const obj = JSON.parse(oReq.responseText)
        // console.log(oReq.responseText)
        this.handleData(obj)
      }
      oReq.send(null)
    },
    handleData(data: any) {
      // 初始数据
      this.loopTime = this.delayTime / 12
      // 音乐数据
      this.bpm = Math.floor(data.time[0].bpm) // todo: time是数组
      this.beatTime = 60000 / this.bpm // 毫秒
      this.countDivideBeatFactor = Math.round(this.beatTime / this.loopTime)
      this.beats = []
      data.note.forEach((ele: any) => {
        let index = Math.round((ele.x - 32) / 64)
        if (index === 1) {
          index = 0
        } else if (index > 1) {
          index = index - 1
        }
        if (ele.beat[0]) {
          this.beats.push({
            beat: ele.beat[0],
            offset: Number((ele.beat[1] / ele.beat[2]).toFixed(2)),
            x: index
          })
        }
      })
      console.log(' this.loopTime ', this.loopTime)
      console.log(' this.bpm ', this.bpm)
      console.log(' this.beatTime ', this.beatTime)
      console.log(' this.countDivideBeatFactor ', this.countDivideBeatFactor)
      console.log(' this.beats ', JSON.stringify(this.beats))
    },
    setTrack1Index(index: number) {
      const indexMap = [0, 1, 2, 3, 4, 5, 6]
      ;(this.$refs as any).keyboard.setIndexLightToggle(indexMap[index], true)
    },
    setTrack2Index(index: number) {
      const indexMap = [7, 8, 9, 10, 11, 12, 13]
      ;(this.$refs as any).keyboard.setIndexLightToggle(indexMap[index], true)
    },
    setTrack3Index(index: number) {
      const indexMap = [14, 15, 16, 17, 18, 19, 20]
      ;(this.$refs as any).keyboard.setIndexLightToggle(indexMap[index], true)
    },
    async handleStart() {
      if (!this.canPlay) {
        alert('音乐正在加载，请稍等重试')
        return
      }
      this.musicPlayer.play()
      // setTimeout(() => {
      //   this.musicPlayer.play()
      // }, 20) // 修正

      this.loopCurrentIndex = 0

      // this.timer = setInterval(() => {
      //   this.handleLoop()
      // }, this.loopTime)
      this.startTime = Date.now()
      this.handleLoop()
    },
    handleScore(index: number) {
      const currentTime = Date.now()
      const effectTime = 100
      let time2 =
        index === 1 ? this.isActive1Time : index === 2 ? this.isActive2Time : this.isActive3Time
      if (currentTime - time2 < 100 && currentTime - time2 > -100) {
        // 完美
        this.score += 100
        navigator.vibrate(100)
        if (index === 1) {
          clearTimeout(this.timer1)
          this.isActive1 = true
          this.timer1 = setTimeout(() => {
            this.isActive1 = false
          }, effectTime)
        } else if (index === 2) {
          clearTimeout(this.timer2)
          this.isActive2 = true
          this.timer2 = setTimeout(() => {
            this.isActive2 = false
          }, effectTime)
        } else {
          clearTimeout(this.timer3)
          this.isActive3 = true
          this.timer3 = setTimeout(() => {
            this.isActive3 = false
          }, effectTime)
        }
      } else if (currentTime - time2 < 200 && currentTime - time2 > -200) {
        this.score += 50
        navigator.vibrate(100)
        if (index === 1) {
          clearTimeout(this.timer1)
          this.isWell1 = true
          this.timer1 = setTimeout(() => {
            this.isWell1 = false
          }, effectTime)
        } else if (index === 2) {
          clearTimeout(this.timer2)
          this.isWell2 = true
          this.timer2 = setTimeout(() => {
            this.isWell2 = false
          }, effectTime)
        } else {
          clearTimeout(this.timer3)
          this.isWell3 = true
          this.timer3 = setTimeout(() => {
            this.isWell3 = false
          }, effectTime)
        }
      } else {
        if (index === 1) {
          clearTimeout(this.timer1)
          this.isWrong1 = true
          this.timer1 = setTimeout(() => {
            this.isWrong1 = false
          }, effectTime)
        } else if (index === 2) {
          clearTimeout(this.timer2)
          this.isWrong2 = true
          this.timer2 = setTimeout(() => {
            this.isWrong2 = false
          }, effectTime)
        } else {
          clearTimeout(this.timer3)
          this.isWrong3 = true
          this.timer3 = setTimeout(() => {
            this.isWrong3 = false
          }, effectTime)
        }
      }
    },
    handleLoop() {
      // 建立循环体，x=200ms,执行一次；生成currentBeat: beats = Math.floor(count / (countDivideBeatFactor=3)), if (current!=beats) ```
      // 6: 每次循环执行逻辑：1. 提前点灯：for循环beats，如果beat - currentbeat <= 2, index = beat * 3 - count)
      // 7. 如果beat < currentbeat跳过，如果beat - currentbeat > 2, 结束循环,
      const currentBeat = Math.floor(this.count / this.countDivideBeatFactor) // 6 / 3 = 2
      const beats = this.beats
      // console.log(currentBeat, this.loopCurrentIndex, 'currentBeat - loopCurrentIndex')
      // 点灯逻辑
      ;(this.$refs as any).keyboard.setAllLightOff()
      for (let i = this.loopCurrentIndex; i < beats.length; i++) {
        const beat = beats[i].beat
        const offset = beats[i].offset
        const trackIndex = beats[i].x

        let total = beat * this.countDivideBeatFactor
        if (offset) {
          total = total + Math.round(this.countDivideBeatFactor * offset)
        }
        // if (beat - currentBeat <= 2 && beat - currentBeat > 0) {
        if (total - this.count <= 12 && total - this.count > 0) {
          // 12 = 2 * this.countDivideBeatFactor
          let index = beat * this.countDivideBeatFactor - this.count // 0-6
          if (offset) {
            index = index + Math.round(this.countDivideBeatFactor * offset)
          }
          if (index >= 0 && index <= 6) {
            if (trackIndex === 0) {
              this.setTrack1Index(index)
              if (index === 1) {
                this.isActive1Time = Date.now()
              }
            } else if (trackIndex === 1) {
              this.setTrack2Index(index)
              if (index === 1) {
                this.isActive2Time = Date.now()
              }
            } else {
              this.setTrack3Index(index)
              if (index === 1) {
                this.isActive3Time = Date.now()
              }
            }
          }
          // } else if (beat - currentBeat < 0) {
        } else if (total - this.count < 0) {
          this.loopCurrentIndex = i
          // } else if (beat - currentBeat > 2) {
        } else if (total - this.count > 12) {
          break
        }
      }

      this.count++
      const expect = this.startTime + this.count * this.loopTime
      const offset = Date.now() - expect

      // if (currentBeat > 227) {
      if (currentBeat > 259) {
        this.closeLoop()
      } else {
        this.timer = setTimeout(() => {
          this.handleLoop()
        }, this.loopTime - offset)
      }
    },
    closeLoop() {
      clearInterval(this.timer)
      this.musicPlayer.pause()
      // location.reload()
    },

    // End music 相关
    handleCancel() {
      this.closeLoop()
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
  left: 104px;
  z-index: 100;

  display: flex;
  // width: 400px;
  // margin-top: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  .block {
    width: 89px;
    height: 89px;

    // margin: 5px;
    border: 2px solid #444;
    background-color: #fff;
    transition: background-color 0.8s ease;

    &.active {
      background-color: yellow;
    }
    &.perfect {
      transition: background-color 0.2s ease;
      background-color: green;
    }
    &.well {
      transition: background-color 0.2s ease;
      background-color: yellow;
    }
    &.wrong {
      transition: background-color 0.2s ease;
      background-color: red;
    }
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
