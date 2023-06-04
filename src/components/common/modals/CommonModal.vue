<template>
  <v-dialog v-model="isOpen" :persistent="persist" :width="width" :disabled="disabled" @update:modelValue="() => emit('input', isOpen)">
    <v-card>
      <v-card-title>{{props.title}}</v-card-title>
      <v-card-text>
        <slot name="contents"></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="buttons"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch, watchEffect} from "vue";

const props = defineProps({width: Number, title: String, open: Boolean, disabled: Boolean, persist: Boolean});
const emit = defineEmits(['input']);
let isOpen = ref(props.open);

// Vuetify 모달창 내에서 v-select 사용시 발생하는 라이브러리 버그 해결용
// https://github.com/vuetifyjs/vuetify/issues/16770
watchEffect(() => {
  document.documentElement.style.overflow = isOpen.value ? 'hidden' : null;
});
watch(() => props.open, () => {isOpen.value = props.open});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
