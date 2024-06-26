<template>
  <div class="keyboard">
    <ul class="keyboard_wrap">
      <li
        v-for="item in list"
        class="li-item"
        :class="{ active: item.isActive }"
        :data-tapitem="item.note"
        :key="item.index"
      >
        <!-- 封装点击与触摸 -->
        <Tap :tid="item.note" @tapdown="tapDown" @tapup="tapup"> </Tap>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Tap from './Tap.vue'
/* eslint-disable */
import SampleLibrary from '@/lib/Tonejs-Instruments'
import { isString } from 'tone'
import { defineComponent } from 'vue'

const conf = {
  total: 21,
  tone: 4,
  notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
}

export default defineComponent({
  // name: 'keyboard',
  components: {
    Tap
  },
  data() {
    return {
      // synth: null as any,
      currentStep: 0,
      currentMusic: 1,
      toPlayingAI: false,
      list: createKeyboard(conf),
      musicArr: [
        // 菊次郎的夏天
        [
          ['5', '1+', '2+', '3+', '2+', '1+', '1+'],
          ['5', '1+', '2+', '3+', '2+', '1+', '2+', '3+', '3+'],
          ['5', '1+', '2+', '3+', '2+', '1+', '1+'],
          ['5', '1+', '2+', '3+', '2+', '1+', '2+', '5+', '3+']
        ],
        [
          ['5', '5', '3', '4', '5', '6', '5', '4', '3', '2'],
          ['3', '3', '1', '2', '3', '4', '3', '2', '1', '7-'],
          ['6-', '6-', '1', '6', '5', '5', '1'],
          ['2', '3', '4', '3', '2', '1', '3', '3', '2']
        ]
      ],
      inputArr: [] as string[]
    }
  },
  created() {
    // console.table(createKeyboard(conf))
  },
  mounted() {
    ;(this as any).synth = (
      SampleLibrary.load({
        instruments: 'piano'
      }) as any
    ).toDestination()
  },
  methods: {
    // 所有灯都熄灭
    setAllLightOff() {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].isActive = false
      }
    },
    // 指定id灯亮灭
    setIndexLightToggle(index: number, bool: boolean) {
      this.list[index].isActive = bool
    },
    handleClick(data: any) {
      console.log('click')
    },
    handleCancel() {
      console.log('click')
    },
    handleFinishAI() {
      this.toPlayingAI = false
      this.$emit('changeStatus', 'Normal')
      this.inputArr = []
      this.currentStep = 0
      this.$emit('changeRightNum', 0)
      this.$emit('changeStep', 0)
      if (this.currentMusic == 0) {
        this.currentMusic = 1
      } else {
        this.currentMusic = 0
      }
    },
    handlePlayAI(index = 0) {
      this.toPlayingAI = false
      this.$emit('changeStatus', 'AI Playing')
      const arr = this.musicArr[this.currentMusic]
      if (this.currentStep < 4) {
        const subArr = arr[this.currentStep]
        const arrTarget = this.numberToNote(subArr)
        let start = 0
        const fn = (note: string) => {
          if (note) {
            this.tapDown(note)
            setTimeout(() => {
              this.tapup(note)
            }, 200)
          }
          start++
          if (start < arrTarget.length) {
            setTimeout(() => {
              fn(arrTarget[start])
            }, 400)
          } else {
            // 显示第一个Note
            setTimeout(() => {
              for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].note == arrTarget[0]) {
                  this.list[i].isActive = true
                  return
                }
              }
            }, 500)
            this.toPlayingAI = true
            this.$emit('changeStatus', 'Start play')

            // 弹奏完毕
            // this.currentStep = this.currentStep + 1
            // this.$emit('changeStep', this.currentStep)
            // setTimeout(() => {
            //   this.handlePlayAI()
            // }, 1000)
          }
        }
        fn(arrTarget[0])
      } else {
        // this.toPlayingAI = true
        // this.handleFinishAI()
      }
    },
    // 检查当前播放是否正确
    handleCheckReplay(note: string) {
      const arr = this.musicArr[this.currentMusic]
      const subArr = arr[this.currentStep]
      const arrTarget = this.numberToNote(subArr)
      // 检查最后一位是否正确
      this.inputArr.push(note)
      console.log(
        '对比',
        this.inputArr[this.inputArr.length - 1],
        arrTarget[this.inputArr.length - 1]
      )
      if (this.inputArr[this.inputArr.length - 1] == arrTarget[this.inputArr.length - 1]) {
        this.$emit('changeRightNum', this.inputArr.length)
      } else {
        this.$emit('changeRightNum', this.inputArr.length)
        // 错误的话提示错误对象
        let index = -1
        let start = -1
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].note == arrTarget[0]) {
            start = i
          }
          if (this.list[i].note == arrTarget[this.inputArr.length - 1]) {
            index = i
          }
        }
        this.list[index].isActive = true
        setTimeout(() => {
          this.list[index].isActive = false
          setTimeout(() => {
            this.list[index].isActive = true
            setTimeout(() => {
              this.list[index].isActive = false
              setTimeout(() => {
                this.list[index].isActive = true
                setTimeout(() => {
                  this.list[index].isActive = false
                  setTimeout(() => {
                    this.list[start].isActive = true
                  }, 1600)
                }, 400)
              }, 400)
            }, 400)
          }, 400)
        }, 400)

        this.inputArr = []
      }
      if (this.inputArr.length === arrTarget.length) {
        // 弹奏完毕
        this.toPlayingAI = false
        this.inputArr = []
        this.currentStep = this.currentStep + 1
        if (this.currentStep < 4) {
          this.$emit('changeStep', this.currentStep)
          setTimeout(() => {
            this.handlePlayAI()
          }, 1000)
        } else {
          this.handleFinishAI()
        }
      }
    },
    numberToNote(arr: any[]) {
      const LowMap = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
      const MidMap = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5']
      const HightMap = ['C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6']
      let numArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
          numArr.push('')
        } else if (isString(arr[i])) {
          if (arr[i][1] == '+') {
            numArr.push(HightMap[Number(arr[i][0]) - 1])
          } else if (arr[i][1] == '-') {
            numArr.push(LowMap[Number(arr[i][0]) - 1])
          } else {
            numArr.push(MidMap[Number(arr[i][0]) - 1])
          }
        } else {
          numArr.push(MidMap[Number(arr[i]) - 1])
        }
      }
      return numArr
    },
    play(noteName: any) {
      ;(this as any).synth.triggerAttackRelease(noteName)
      this.$emit('play', noteName)
    },

    tapDown(noteName: string, channel = 1) {
      console.log(noteName)
      // this.play(noteName)
      // this.tapNote(noteName, 'down')

      // 设置对应类名
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].note == noteName) {
          this.list[i].isActive = true
          break
        }
      }
      // 如果是在AI中， 检查
      if (this.toPlayingAI) {
        this.handleCheckReplay(noteName)
      }
    },
    tapup(noteName: string) {
      this.tapNote(noteName, 'up')

      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].note == noteName) {
          this.list[i].isActive = false
          return
        }
      }
    },
    tapNote(noteName: string, action: string) {
      const ins = this.$refs[`n_${noteName}`] as any

      if (!ins || !ins[0]) return

      if (action === 'down') {
        ins[0].tapdown()
      } else {
        ins[0].tapup()
      }
    },
    release() {
      this.list.forEach((e) => this.tapNote(e.note, 'up'))
    }
  }
})

function createKeyboard(data: any) {
  const { total, tone, notes } = data
  const nlen = notes.length
  let currLv = tone - 1

  return [...Array(total)].map((e, i) => {
    const note = notes[i % nlen]

    if (note === notes[0]) currLv++

    return { note: note + currLv, index: i, isActive: false }
  })
}
</script>

<style lang="scss" scoped>
$noteHeight: 94px;
.keyboard {
  height: 68vmin;
  max-height: 380px;
  width: 100%;
  position: relative;
}

.keyboard_wrap {
  width: 100%;
  height: 100%;
  list-style: none;
  user-select: none;
}

.drop-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: copy;
  outline: 2px dashed #fefcb2;
}

.keyboard_wrap::before,
.keyboard_wrap::after {
  display: block;
  content: '';
  clear: both;
}

.keyboard_wrap li {
  position: relative;
  width: calc(100% / 7);
  height: $noteHeight;
  float: left;
  overflow: hidden;
  border: 1px solid #fff;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  z-index: 1;
  background: #444;
}
.li-item::before {
  content: '';
  position: absolute;
  background: #fff;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  filter: blur(10px);
  opacity: 0;
  // transition: opacity 2s;
  z-index: -1;
}
.li-item.active::before {
  opacity: 1;
  // transition: opacity 0.5s;
}
</style>
