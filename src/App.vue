<template>
  <div class="main">
    <div class="main-box">
      <!-- 第一排功能按键 -->
      <div class="menu-box">
        <div class="m-btn btn-ai" @mousedown="handlePlayAI">Z</div>
        <!-- screen field -->
        <Screen :current="currentStep" :rightnumber="rightNumber" :status="status" />
        <!-- 功能键 -->
        <div class="m-btn" @click="handleCancel">Auto</div>
        <!-- 扬声器位置示意 -->
        <div class="btn-micro"></div>
      </div>
      <!-- 第二排开始，3*7的键盘布局 -->
      <Keyboard
        ref="keyboard"
        @changeStep="changeStep"
        @changeStatus="changeStatus"
        @changeRightNum="changeRightNum"
      />
    </div>
  </div>

  <!-- <RouterView /> -->
</template>

<script lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import Keyboard from '@/components/keyboard/Layout.vue'
import Screen from '@/components/Screen.vue'
// import Droparea from '@/components/Droparea'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!',
      stageSize: '',
      status: 'Normal',
      currentStep: 0,
      rightNumber: 0,
      totalStep: 4
    }
  },
  components: {
    Keyboard,
    Screen
  },
  computed: {
    // frameStyle() {
    //   const { width, height } = this.stageSize
    //   return {
    //     backgroundImage: `url(${this.bgUrl})`,
    //     height: height + 'px',
    //     width: width + 'px'
    //   }
    // }
  },
  mounted() {
    // this.greeting // 类型：string
  },
  methods: {
    handleCancel() {
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
    },
    // changeBg(url) {
    //   this.bgUrl = url
    //   localStorage.setItem('bgUrl', url)
    // },
    // initWaveLine() {
    //   this.$refs.waveline.start()
    // },
    // onPlay(note) {
    //   this.$refs.waveline.touch()
    // },
    // getPlayer() {
    //   if (this._playerPromise) {
    //     return this._playerPromise
    //   }

    //   this._playerPromise = import('../lib/midiPlayer')
    //     .then(mod => mod.default)
    //     .then(player => {
    //       return player.setEventProxy(eventBus)
    //     })

    //   eventBus.on('player:fileLoaded', ctx => {
    //     this.tracks = ctx.tracks.length
    //   })

    //   eventBus.on('player:midiEvent', e => {
    //     const note = e.noteName

    //     if (e.name === 'Note on') {
    //       if (e.velocity > 0) {
    //         this.keyboard.tapdown(note, e.channel)
    //       } else {
    //         this.keyboard.tapup(note)
    //       }
    //     } else if (e.name === 'Note off') {
    //       this.keyboard.tapup(note)
    //     }
    //   })

    //   eventBus.on('player:play', () => {
    //     console.log('[player] play')
    //   })

    //   eventBus.on('player:sleep', () => {
    //     this.keyboard.release()
    //     console.log('[player] sleep')
    //   })

    //   console.log('[player] regist')

    //   return this._playerPromise
    // },
    onDropMidi(res: any) {
      // this.getPlayer().then(player => {
      //   player.stop()
      //   if (res.code === 0) {
      //     player.load(res.data, res.file).play()
      //     console.log('play', res.file)
      //   }
      // })
    }
  }
})
</script>

<style scoped>
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
