<template>
  <!-- 首次渲染不要使用 prevent 阻止 touchstart 和 touchend，以确保 click 能正常触发 -->
  <!-- touchstart -> touchend -> mousedown -> mouseup -> click -->
  <div
    class="tap"
    :data-tapitem="tid"
    @mousedown="mouseDown"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
    @mouseup="mouseUp"
    @touchstart="touchHandle"
    @touchmove.prevent="touchHandle"
    @touchend="touchHandle"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { findEl, hasParent } from '@/lib/util'
import { defineComponent } from 'vue'

// 全局共享状态
let isMouseDown = false
let hasTouchEvt = false

window.addEventListener('mouseup', () => (isMouseDown = false))

export default defineComponent({
  props: ['tid'],
  data() {
    return {
      touches: [],
      pressMap: {} as any
    }
  },
  mounted() {},
  methods: {
    press(key: string) {
      this.$emit('tapdown', key)
    },
    release(key: string) {
      this.$emit('tapup', key)
    },
    mouseDown(e: any) {
      if (hasTouchEvt) return

      const k = this.tid

      if (!this.pressMap[k]) {
        this.press(k)
        isMouseDown = true
        this.pressMap[k] = 'M'
      }
      console.log('mouseDown', e, k)
    },
    mouseUp(e: any) {
      if (hasTouchEvt) return

      const k = this.tid

      if (isMouseDown && this.pressMap[k] == 'M') {
        this.release(k)
        delete this.pressMap[k]
        isMouseDown = false
      }
      // console.log('mouseUp', isMouseDown)
    },
    mouseOver(e: any) {
      const k = this.tid

      // console.log('mouseOver', e)
      if (isMouseDown && !this.pressMap[k]) {
        this.press(k)
        this.pressMap[k] = 'M'
      }
    },
    mouseOut(e: any) {
      const k = this.tid

      if (isMouseDown && this.pressMap[k] == 'M' && !hasParent(e.relatedTarget, this.$el)) {
        // console.log('mouseOut', e.relatedTarget)
        this.release(k)
        delete this.pressMap[k]
      }
    },
    touchHandle(e: any) {
      if (hasTouchEvt) {
        e.preventDefault()
      } else if (e.type === 'touchend') {
        // 在 touchend 后执行此逻辑，以确保 click 被响应
        hasTouchEvt = true
      }

      // 移动端支持多点触摸
      const targets = this.getTouchTargets(e.touches)

      this.releaseTouches(targets)
      this.touches = this.markTouches(targets)

      return true
    },
    markTouches(targets: any) {
      const inTouches = (k: number) => {
        return (this.touches as any).indexOf(k) > -1
      }

      return targets
        .map((k: any) => {
          if (inTouches(k)) {
            return k
          } else if (!this.pressMap[k]) {
            this.press(k)
            this.pressMap[k] = 'T'

            return k
          }
        })
        .filter(Boolean)
    },
    releaseTouches(targets: any) {
      const matchTargets = (k: any) => targets.indexOf(k) > -1

      // 释放不在当前目标中的项目
      this.touches.forEach((k) => {
        if (matchTargets(k)) return

        this.release(k)
        delete this.pressMap[k]
      })
    },
    getTouchTargets(touches: any) {
      const finder = (el: any) => el.dataset && el.dataset['tapitem']

      return [...touches].map((el) => findEl(el.clientX, el.clientY, finder)).filter(Boolean)
    },
    click() {
      console.log('click')
    }
  }
})
</script>

<style scoped>
.tap {
  height: 100%;
  width: 100%;
}
</style>
