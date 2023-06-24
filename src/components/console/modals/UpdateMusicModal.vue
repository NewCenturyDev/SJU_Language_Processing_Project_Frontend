<template>
  <update-entity-modal
      :open="isOpen"
      :entity="music"
      title="음악"
      endpoint="/musics"
      @input="(status) => {emit('input', status);}"
      @check="checkDetailValidity"
      @finished="emit('finished')"
  >
    <template v-slot:contents="slotProps">
      <music-input-component
          ref="musicRef"
          :is-new="false"
          :default-entity="music"
          :set-entity="slotProps.setEntityDTO"
      ></music-input-component>
    </template>
  </update-entity-modal>
</template>
<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import UpdateEntityModal from "@/components/common/modals/UpdateEntityModal.vue";
import MusicInputComponent from "@/components/console/modals/components/MusicInputComponent";

// update-entity-modal 의 렌더링 조건이 만족되었을 때만 유효한 emit 이나
// conditional 한 emit 을 디버거가 잘 인식하지 못해 없는 emit/불필요한 emit 경고를 잘못 띄우는 문제를 해결하기 위해
// 명시적으로 emit 을 포워딩한 다음, eslint 경고 무시 주석 선언
// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['input', 'finished']);
const props = defineProps({open: Boolean, music: Object});
let musicRef = ref(null);
let isOpen = ref(props.open);

async function checkDetailValidity(execute) {
  if (await musicRef.value.validate()) {
    await execute();
  }
}

watch(() => props.open, () => {isOpen.value = props.open;});
</script>
