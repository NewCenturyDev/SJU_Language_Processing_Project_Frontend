<template>
  <common-modal
      title="음악 업로드"
      :width="700"
      :open="isOpen"
      :persist="true"
      @input="close"
  >
    <template v-slot:contents>
      <music-input-component
          ref="musicRef"
          :is-new="true"
          :default-entity="music"
          :set-entity="setEntityDTO"
      ></music-input-component>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="reqUploadMusic" variant="text" color="secondary">저장</v-btn>
      <v-btn @click="close" variant="text">취소</v-btn>
    </template>
  </common-modal>
</template>

<script setup>
import {defineProps, defineEmits, ref, watch} from "vue";
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import CommonModal from "@/components/common/modals/CommonModal";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import MusicInputComponent from "@/components/console/modals/components/MusicInputComponent";

const emit = defineEmits(['input', 'finished']);
const props = defineProps({open: Boolean, music: Object});
const store = useCredentialStore();
const entityDTO = ref(null);
let musicRef = ref(null);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open});

function setEntityDTO(dto) {
  entityDTO.value = dto;
}

async function reqUploadMusic() {
  if (await musicRef.value.validate()) {
    const formData = new FormData;
    formData.append('title', entityDTO.value['title']);
    formData.append('author', entityDTO.value['author']);
    formData.append('artist', entityDTO.value['artist']);
    formData.append('category', entityDTO.value['category']);
    formData.append('file', entityDTO.value['file'][0]);
    console.log(formData);
    try {
      await axios.post(`${api.SERVER_URL}/musics`, formData, {
        headers: {Authorization: store['token']},
      });
      emit('finished');
      alert('음악 업로드에 성공했습니다.')
      close();
    } catch (error) {
      api.handleHttpError(error);
    }
  }
}

function close() {
  isOpen.value = false;
  emit('input', false);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
