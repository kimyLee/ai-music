<template>
  <div class="screen">
    <div>{{ status }}···</div>
    <div>得分：{{ text }}</div>
    <!-- <div v-show="status != 'Normal'">第{{ current + 1 }}节 / 总4节</div> -->
    <div>
      <span v-for="item in rightnumber" :key="item" class="right-box"></span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // name: 'Note',
  props: ['current', 'rightnumber', 'status', 'text'],
  components: {
    // Shape
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
})
</script>

<style lang="scss" scope>
@import '@/style/variable.scss';
// $btnWidth : 92px

.screen {
  font-family: 'pixel';
  padding: 20px;
  box-sizing: border-box;
  width: $btnWidth * 3;
  height: $btnWidth;
  font-size: 24px;
  border: 1px solid #444;
  .right-box {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #444;
    margin-left: 10px;
  }
}
</style>
