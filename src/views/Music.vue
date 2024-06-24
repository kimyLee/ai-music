<template>
  <div class="main">
    <div class="main-box">
      <!-- 第一排功能按键 -->
      <div class="menu-box">
        <div class="m-btn btn-ai" @mousedown="handlePlayAI">Z</div>
        <!-- screen field -->
        <Screen :current="currentStep" :rightnumber="rightNumber" :status="status" />
        <!-- 功能键 -->
        <div class="m-btn" @click="handleCancel">Cancel</div>
        <!-- 扬声器位置示意 -->
        <div class="btn-micro" @click="handleStart"></div>
      </div>
      <!-- 第二排开始，3*7的键盘布局 -->
      <div class="test-block-box">
        <div class="block" :class="{ active: isActive1 }"></div>
        <div class="block" :class="{ active: isActive2 }"></div>
        <div class="block" :class="{ active: isActive3 }"></div>
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
      // 音乐掉落相关变量
      loopTimer: null as any,
      currentTime: 0,
      hasInit: false,
      track1Notes: [] as any[],
      track2Notes: [] as any[],
      track3Notes: [] as any[],
      track1: [] as any[],
      track2: [] as any[],
      track3: [] as any[],
      trackLoopIndex1: 0,
      trackLoopIndex2: 0,
      trackLoopIndex3: 0,
      isActive1: false,
      isActive2: false,
      isActive3: false,
      timer1: null as any,
      timer2: null as any,
      timer3: null as any
    }
  },
  components: {
    Keyboard,
    Screen
  },
  computed: {},
  mounted() {
    this.initKeyNote()
    // this.greeting // 类型：string
    // ok 1. 获取note数组原始时刻表，time表示秒
    // ok 2. 维护三个数组，格式=[[name, time],[name, time]···]；表示三个通道的音符
    // ok 3. 上述数组中的time， toFixed(1)
    // ok 4. 构造一个时间循环函数；每100ms执行一次；记录当前累计时间(0.1)
    // 5. 循环体内，（time > 2s）从time >= 当前累计时间 - 0.4 开始遍历，直到 time > 当前累计时间 + 2.4 结束
    // 6: 亮灯规则，每个轨道上，0-6表示7个灯(左往右)；(time - 当前累计时间) * 10 / 4 （floor） + 1
    // 7. else 如果 (当前累计时间 - time) < 0.4 && (当前累计时间 - time) > 0 0号灯亮
    // 8. else 不显示
    // 9. 点击正确亮灯逻辑，绿灯和红灯
    // 10. 正确计分逻辑
  },
  methods: {
    // 音乐相关
    async initKeyNote() {
      const obj = {} as any
      // all note 版本
      // const track1 = ['G3', 'G#2', 'F3', 'G4', 'G#3', 'F4', 'C3', 'G#4']
      // const track2 = ['D4', 'A#4', 'F#4', 'A#2', 'D#5', 'C5', 'F5', 'A#3']
      // const track3 = ['G5', 'D#3', 'C4', 'B2', 'D5', 'D3', 'D#4']
      // const track1 = ['G4', 'F4', 'G#4', 'D4']
      // const track2 = ['F#4', 'D#5', 'C5', 'F5']
      // const track3 = ['G5', 'C4', 'D5', 'D#4', 'A#4']

      midi = await Midi.fromUrl('/ai-music/dist/7.mid')
      midi.tracks.forEach((track: any, index: number) => {
        console.log(midi.tracks.length, track.notes.length, ' track.notes', index)
        track.notes.forEach((note: any) => {
          // 收集所有notes
          obj[note.name] = 1
        })
      })
      const arr = Object.keys(obj)
      arr.sort(() => Math.random() - 0.5)
      const track1 = arr.slice(0, Math.floor(arr.length / 3))
      const track2 = arr.slice(Math.floor(arr.length / 3), Math.floor(arr.length / 3) * 2)
      const track3 = arr.slice(Math.floor(arr.length / 3) * 2)
      midi.tracks.forEach((track: any, index: number) => {
        track.notes.forEach((note: any) => {
          // if (track1.indexOf(note.name) >= 0) {
          //   this.track1.push({ name: note.name, time: note.time.toFixed() })
          // } else if (track2.indexOf(note.name) >= 0) {
          //   this.track2.push({ name: note.name, time: note.time.toFixed(1) })
          // } else if (track3.indexOf(note.name) >= 0) {
          //   this.track3.push({ name: note.name, time: note.time.toFixed(1) })
          // }
          if (track1.indexOf(note.name) >= 0) {
            this.track1.push({ name: note.name, time: note.time })
          } else if (track2.indexOf(note.name) >= 0) {
            this.track2.push({ name: note.name, time: note.time })
          } else if (track3.indexOf(note.name) >= 0) {
            this.track3.push({ name: note.name, time: note.time })
          }
        })
      })

      this.hasInit = true
      this.track1Notes = track1
      this.track2Notes = track2
      this.track3Notes = track3
      console.log('hasInit')
      console.log(JSON.stringify(arr))
      console.log(JSON.stringify(this.track1))
      console.log(JSON.stringify(this.track2))
      console.log(JSON.stringify(this.track3))
    },
    initTrackNotes() {},
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
      const track1 = this.track1Notes
      const track2 = this.track2Notes
      const track3 = this.track3Notes

      // 播放音乐
      await Tone.start()
      const samplerTemp = new Tone.Sampler({
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
        release: 1,
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        onload: () => {
          Tone.loaded().then(() => {
            // 开始循环
            this.handleLoop()

            const part = new Tone.Part(
              (time, note) => {
                samplerTemp.triggerAttackRelease(note.name, note.duration, time)
                // 在音符播放时执行一些动作
                // 在音符播放时执行一些动作
                // console.log(note.time, 'note.time--- ', this.currentTime, 'currentTime')
                if (track1.indexOf(note.name) >= 0) {
                  this.trackLoopIndex1++
                  clearTimeout(this.timer1)
                  this.isActive1 = true
                  this.timer1 = setTimeout(() => {
                    this.isActive1 = false
                  }, 100)
                } else if (track2.indexOf(note.name) >= 0) {
                  this.trackLoopIndex2++
                  clearTimeout(this.timer2)
                  this.isActive2 = true
                  this.timer2 = setTimeout(() => {
                    this.isActive2 = false
                  }, 100)
                } else if (track3.indexOf(note.name) >= 0) {
                  this.trackLoopIndex3++
                  clearTimeout(this.timer3)
                  this.isActive3 = true
                  this.timer3 = setTimeout(() => {
                    this.isActive3 = false
                  }, 100)
                }
                // console.log(`Playing note: ${note.name} at time: ${time}`)
              },
              midi.tracks.flatMap((track: any) =>
                track.notes.map((note: any) => ({
                  time: note.time,
                  name: note.name,
                  duration: note.duration
                }))
              )
            )
            part.start(0)
          })

          // 调用 Tone.js Transport 来控制播放
          Tone.Transport.start()
        }
      }).toDestination()

      // 开始循环
    },
    handleLoop() {
      // 5. 循环体内，（currentTime > 1s）从time >= 当前累计时间 - 0.4 开始遍历，直到 time > 当前累计时间 + 2.4 结束
      const track1 = this.track1
      const track2 = this.track2
      const track3 = this.track3
      // const currentTime = this.currentTime
      const currentTime = Tone.Transport.seconds
      this.currentTime = currentTime

      if (currentTime > 1) {
        ;(this.$refs as any).keyboard.setAllLightOff()
        // 从起点开始
        for (let i = this.trackLoopIndex1; i < track1.length; i++) {
          const time = track1[i].time
          // 在可视范围内
          console.log(time, 'time-currentTime', currentTime, 'track1', i)
          if (time >= currentTime && time <= currentTime + 2.4) {
            const index = Math.floor(((time - currentTime) * 10) / 4) + 1
            if (index >= 1 && index <= 6) {
              this.setTrack1Index(index)
            }
            // } else if (currentTime - time < 0.4 && currentTime - time > 0) {
            //   this.setTrack2Index(0)
          } else if (time > currentTime + 2.4) {
            // this.trackLoopIndex1 = i + 1
            // console.log('trackLoopIndex1', this.trackLoopIndex1)
            break
          }
        }

        // 2
        for (let i = this.trackLoopIndex2; i < track2.length; i++) {
          const time = track2[i].time
          // 在可视范围内
          if (time >= currentTime && time <= currentTime + 2.4) {
            const index = Math.floor(((time - currentTime) * 10) / 4) + 1
            if (index >= 1 && index <= 6) {
              this.setTrack2Index(index)
            }
            // } else if (currentTime - time < 0.4 && currentTime - time > 0) {
            //   this.setTrack2Index(0)
          } else if (time > currentTime + 2.4) {
            // this.trackLoopIndex2 = i + 1
            // console.log('trackLoopIndex2', this.trackLoopIndex2)
            break
          }
        }
        // 3
        for (let i = this.trackLoopIndex3; i < track3.length; i++) {
          const time = track3[i].time
          // 在可视范围内
          if (time >= currentTime && time <= currentTime + 2.4) {
            const index = Math.floor(((time - currentTime) * 10) / 4) + 1
            if (index >= 1 && index <= 6) {
              this.setTrack3Index(index)
            }
            // } else if (currentTime - time < 0.4 && currentTime - time > 0) {
            //   this.setTrack2Index(0)
          } else if (time > currentTime + 2.4) {
            // this.trackLoopIndex3 = i + 1
            // console.log('trackLoopIndex3', this.trackLoopIndex3)
            break
          }
        }
      }

      this.loopTimer = setTimeout(() => {
        // this.currentTime = Number((this.currentTime + 0.02).toFixed(2))
        this.handleLoop()
      }, 30)
    },
    closeLoop() {
      clearTimeout(this.loopTimer)
      location.reload()
    },

    // End music 相关
    handleCancel() {
      this.closeLoop()
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
  border: 2px solid #ccc;
  border-radius: 10px;
  max-width: 677px;
  max-height: 400px;
  padding: 10px;
  box-sizing: border-box;
}
.test-block-box {
  position: absolute;
  bottom: 15px;
  left: 105px;
  z-index: 100;

  display: flex;
  // width: 400px;
  // margin-top: 100px;
  flex-direction: column;
  justify-content: space-around;
  opacity: 0.6;
  .block {
    width: 85px;
    height: 86px;
    border: 3px solid green;
    background-color: #fff;
    &.active {
      background-color: yellow;
    }
  }
}

@media screen and (max-width: 1200px) {
  .main-box {
    width: 100%;
    height: 100%;
    max-width: 677px;
    max-height: 400px;
    transform: scale(0.9) translateY(-25px);
  }
}
</style>
