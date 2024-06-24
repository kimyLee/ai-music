<template>
  <div class="test">
    <h1 @click="handleStart">开始音乐</h1>
    <h1 @click="handleClose">关闭音乐</h1>
    <br />
    <input type="file" id="midiInput" accept=".mid,.midi" />

    <div class="ball" :class="{ active: isActive }"></div>
    <div class="block-box">
      <div class="block" :class="{ active: isActive1 }"></div>
      <div class="block" :class="{ active: isActive2 }"></div>
      <div class="block" :class="{ active: isActive3 }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// 测试音乐游戏
import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'

let globalMidi = null as any
let synths = [] as any[]

const NotesMap: any = {
  C2: 'a49.mp3',
  D2: 'a50.mp3',
  E2: 'a51.mp3',
  F2: 'a52.mp3',
  G2: 'a53.mp3',
  A2: 'a54.mp3',
  B2: 'a55.mp3',
  C3: 'a56.mp3',
  D3: 'a57.mp3',
  E3: 'a48.mp3',
  F3: 'a81.mp3',
  G3: 'a87.mp3',
  A3: 'a69.mp3',
  B3: 'a82.mp3',
  C4: 'a84.mp3',
  D4: 'a89.mp3',
  E4: 'a85.mp3',
  F4: 'a73.mp3',
  G4: 'a79.mp3',
  A4: 'a80.mp3',
  B4: 'a65.mp3',
  C5: 'a83.mp3',
  D5: 'a68.mp3',
  E5: 'a70.mp3',
  F5: 'a71.mp3',
  G5: 'a72.mp3',
  A5: 'a74.mp3',
  B5: 'a75.mp3',
  C6: 'a76.mp3',
  D6: 'a90.mp3',
  E6: 'a88.mp3',
  F6: 'a67.mp3',
  G6: 'a86.mp3',
  A6: 'a66.mp3',
  B6: 'a78.mp3',
  C7: 'a77.mp3',
  'C#2': 'b49.mp3',
  'D#2': 'b50.mp3',
  'F#2': 'b52.mp3',
  'G#2': 'b53.mp3',
  'A#2': 'b54.mp3',
  'C#3': 'b56.mp3',
  'D#3': 'b57.mp3',
  'F#3': 'b81.mp3',
  'G#3': 'b87.mp3',
  'A#3': 'b69.mp3',
  'C#4': 'b84.mp3',
  'D#4': 'b89.mp3',
  'F#4': 'b73.mp3',
  'G#4': 'b79.mp3',
  'A#4': 'b80.mp3',
  'C#5': 'b83.mp3',
  'D#5': 'b68.mp3',
  'F#5': 'b71.mp3',
  'G#5': 'b72.mp3',
  'A#5': 'b74.mp3',
  'C#6': 'b76.mp3',
  'D#6': 'b90.mp3',
  'F#6': 'b67.mp3',
  'G#6': 'b86.mp3',
  'A#6': 'b66.mp3'
}

export default defineComponent({
  data() {
    return {
      track1: [] as string[],
      track2: [] as string[],
      track3: [] as string[],
      isActive1: false,
      isActive2: false,
      isActive3: false,
      timer1: null as any,
      timer2: null as any,
      timer3: null as any,
      // midi: null as any,
      Player: null as any,
      isActive: false,
      timer: null as any,
      playing: false,
      currentTime: 0,
      currentIndex: 0,
      playArr: [1, 3, 4, 5, 8, 9, 10, 12, 14, 17, 19, 20, 21, 22, 23, 24, 25, 26] as any[]
    }
  },
  components: {},
  computed: {},
  async mounted() {
    this.initKeyNote()

    document.querySelector('body')?.addEventListener(
      'click',
      async () => {
        await Tone.start()
        // console.log('audio is ready')
      },
      false
    )

    // let input = document.getElementById('midiInput')
    // input?.addEventListener('change', (event: any) => {
    //   const file = event.target.files[0]
    //   if (file) {
    //     const reader = new FileReader()

    //     reader.onload = async (e: any) => {
    //       const arrayBuffer = e.target.result
    //       const midi = new Midi(arrayBuffer)
    //       await this.playMIDI(midi)
    //     }

    //     reader.readAsArrayBuffer(file)
    //   }
    // })

    // globalMidi = await Midi.fromUrl('http://localhost:5173/ai-music/dist/flowerdance.mid')

    // 假设我们有一个 MIDI 文件的 ArrayBuffer
    // var oReq = new XMLHttpRequest()
    // oReq.open('GET', '/test.mid', true)
    // oReq.responseType = ''

    // oReq.onload = (oEvent) => {
    //   var arrayBuffer = oReq.response // 注意：不是 oReq.responseText
    //   if (arrayBuffer) {
    //     console.log('读取成功')
    //     var byteArray = new Uint8Array(arrayBuffer)
    //     Player.loadDataUri(arrayBuffer.toString('base64'))
    //     Player.play()
    //     // this.handleMid(byteArray)
    //   }
    // }
    // oReq.send(null)
  },
  methods: {
    initKeyNote() {
      const keynotes = {
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
      }
      let count = 0
      let notes = [[], [], []] as any[]
      for (let item in keynotes) {
        notes[count].push(item)
        count++
        count = count >= 3 ? 0 : count
      }
      console.log(JSON.stringify(notes[0]))
      console.log(JSON.stringify(notes[1]))
      console.log(JSON.stringify(notes[2]))
      this.track1 = notes[0]
      this.track2 = notes[1]
      this.track3 = notes[2]
    },
    async playMIDI() {
      // let midi = globalMidi
      let midi = await Midi.fromUrl('/ai-music/dist/1.mid')
      await Tone.start()

      // 加载钢琴音色样本
      // const samplerTemp = Object.assign({})
      // const temp = Date.now()
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
            const latestNote = midi.tracks[0].notes
            console.log('last ', latestNote[latestNote.length - 1])
            // 创建 Tone.Part 用于调度音符的播放
            const part = new Tone.Part(
              (time, note) => {
                samplerTemp.triggerAttackRelease(note.name, note.duration, time)

                // 在音符播放时执行一些动作
                if (this.track1.indexOf(note.name) >= 0) {
                  clearTimeout(this.timer1)
                  this.isActive1 = true
                  this.timer1 = setTimeout(() => {
                    this.isActive1 = false
                  }, 50)
                } else if (this.track2.indexOf(note.name) >= 0) {
                  clearTimeout(this.timer2)
                  this.isActive2 = true
                  this.timer2 = setTimeout(() => {
                    this.isActive2 = false
                  }, 50)
                } else {
                  clearTimeout(this.timer3)
                  this.isActive3 = true
                  this.timer3 = setTimeout(() => {
                    this.isActive3 = false
                  }, 50)
                }
                console.log(`Playing note: ${note.name} at time: ${time}`)
              },
              midi.tracks.flatMap((track) =>
                track.notes.map((note) => ({
                  time: note.time,
                  name: note.name,
                  duration: note.duration
                }))
              )
            )

            // 将 part 同步到 Tone.Transport 的开始时间
            part.start(0)
          })

          // 调用 Tone.js Transport 来控制播放
          Tone.Transport.start()
        }
        //baseUrl: 'http://localhost:5173/ai-music/dist/piano-mp3/'
      }).toDestination()

      await samplerTemp.loaded

      // 确保采样器加载完成
      // Tone.loaded().then(() => {
      //   console.log('loaded')
      //   console.log(midi.tracks.length, 'midi.tracks')
      //   midi.tracks.forEach((track: any) => {
      //     console.log(track.notes.length, ' track.notes')
      //     track.notes.forEach((note: any) => {
      //       console.log(note.name, note.duration, note.time)
      //       samplerTemp.triggerAttackRelease(note.name, note.duration, note.time)
      //     })
      //   })
      // })
      ;(window as any).currentSampler = samplerTemp
    },
    handleClose() {
      location.reload()
      // Tone.Transport.stop()
      // if ((window as any).currentSampler) {
      //   ;(window as any).currentSampler.dispose()
      //   ;(window as any).currentSampler = null
      // }
    },
    handleStart() {
      this.playing = true
      this.playMIDI()
      this.currentTime = 0
      this.currentIndex = 0

      // this.handleLoop()
    },
    // 循环函数
    handleLoop() {
      this.currentTime = this.currentTime + 50
      // 对应上时间
      if (this.playArr[this.currentIndex] * 500 === this.currentTime) {
        this.isActive = true
        this.currentIndex = this.currentIndex + 1
        setTimeout(() => {
          this.isActive = false
        }, 200)
      }
      if (this.currentIndex >= this.playArr.length) {
        clearTimeout(this.timer)
        return
      }
      // 每50ms执行一次
      this.timer = setTimeout(() => {
        this.handleLoop()
      }, 50)
    },
    closeLoop() {
      clearTimeout(this.timer)
    },
    handleCancel() {
      ;(this.$refs as any).keyboard.handleFinishAI()
    }
  }
})
</script>

<style scoped lang="scss">
.test {
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  .ball {
    width: 20px;
    height: 20px;
    background-color: #444;
    border-radius: 50%;
    position: absolute;
    top: 200px;
    left: 50%;
    transition: transform ease 0.8s;
    &.active {
      transform: translateY(-100px);
    }
  }
  .block-box {
    display: flex;
    width: 400px;
    margin-top: 100px;
    justify-content: space-around;
    .block {
      width: 100px;
      height: 130px;
      border: 1px solid #444;
      background-color: #fff;
      &.active {
        background-color: #444;
      }
    }
  }
}
</style>
