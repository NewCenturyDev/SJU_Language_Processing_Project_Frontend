<template>
  <v-dialog v-model="isOpen" persistent width="800">
    <v-card>
      <v-card-title>{{props.title}}</v-card-title>
      <v-slide-group>
        <v-slide-group-item value="common">
          <v-btn :color="getTabColor(0)" variant="text">1. 공통 기본 정보 입력</v-btn>
        </v-slide-group-item>
        <v-slide-group-item value="detail">
          <v-btn :color="getTabColor(1)" variant="text">2. 상세 정보 원본 입력</v-btn>
        </v-slide-group-item>
        <v-slide-group-item value="option">
          <v-btn :color="getTabColor(2)" variant="text">3. 등록 옵션 설정</v-btn>
        </v-slide-group-item>
        <v-slide-group-item value="register">
          <v-btn :color="getTabColor(3)" variant="text">등록 진행</v-btn>
        </v-slide-group-item>
      </v-slide-group>
      <v-card-text>
        <v-window v-model="tabValue[tabIdx]">
          <v-window-item value="common">
            <slot ref="commonRef" name="common">기본 정보 등록 화면 렌더링 실패</slot>
          </v-window-item>
          <v-window-item value="detail">
            <slot name="detail">상세 정보 등록 화면 렌더링 실패</slot>
          </v-window-item>
          <v-window-item value="option">
            <slot name="option">등록 옵션 설정 화면 렌더링 실패</slot>
          </v-window-item>
          <v-window-item value="register">
            <slot name="register">등록 진행 화면 렌더링 실패</slot>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="emit('prev')" v-if="!isExecuting && tabIdx !== 0">이전</v-btn>
        <v-btn @click="emit('next')" v-if="!isExecuting && tabIdx !== 2">다음</v-btn>
        <v-btn @click="emit('execute')" v-if="tabIdx === 2">등록</v-btn>
        <v-btn @click="close" v-if="!isExecuting">취소</v-btn>
        <v-btn :disabled="!isCompleted" @click="finish" v-else>완료 및 닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {defineProps, defineEmits, ref, watch, watchEffect} from "vue";


const props = defineProps({title: String, open: Boolean, execute: Boolean, complete: Boolean, tabIdx: Number});
const emit = defineEmits(['input', 'prev', 'next', 'execute', 'confirmed'])
const tabValue = ['common', 'detail', 'option', 'register'];
let isOpen = ref(props.open);
let isExecuting = ref(props.execute);
let isCompleted = ref(props.complete);
let tabIdx = ref(props.tabIdx);

// Vuetify 모달창 내에서 v-select 사용시 발생하는 라이브러리 버그 해결용
// https://github.com/vuetifyjs/vuetify/issues/16770
watchEffect(() => {
  document.documentElement.style.overflow = isOpen.value ? 'hidden' : null;
});
watch(() => props.open, () => {isOpen.value = props.open});
watch(() => props.complete, () => {isCompleted.value = props.complete});
watch(() => props.tabIdx, () => {tabIdx.value = props.tabIdx});
watch(() => props.execute, () => {
  isExecuting.value = props.execute;
  if (isExecuting.value) {
    tabIdx.value = 3;
  } else {
    tabIdx.value = 0;
  }
});

function getTabColor(idx) {
  return tabIdx.value === idx ? 'blue' : 'normal';
}
function close() {
  isOpen.value = false;
  emit('input', false);
}
function finish() {
  emit('confirmed');
  close();
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
