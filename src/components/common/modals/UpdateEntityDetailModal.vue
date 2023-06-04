<template>
  <common-modal
    :title="`${props.title} 상세정보 수정`"
    :width="700"
    :open="isOpen"
    @input="close"
  >
  <template v-slot:contents>
    <slot name="contents" :setDetailDTO="setDetailDTO"></slot>
  </template>
  <template v-slot:buttons>
    <v-spacer></v-spacer>
    <v-btn @click="save" variant="text" color="secondary">저장</v-btn>
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

const emit = defineEmits(['input', 'finished', 'check']);
const props = defineProps({open: Boolean, title:String, endpoint:String, entityDetail: Object});
const store = useCredentialStore();
let updateEntityDetailDTO = ref(null);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open});

async function save() {
  await emit('check', async () => {await reqUpdateEntityDetail()});
}

function setDetailDTO(detailDTO) {
  updateEntityDetailDTO.value = detailDTO;
}

async function reqUpdateEntityDetail() {
  updateEntityDetailDTO.value['id'] = props.entityDetail['id'];
  console.log(updateEntityDetailDTO.value);
  try {
    await axios.put(`${api.SERVER_URL}/${props.endpoint}/details`, updateEntityDetailDTO.value, {
      headers: {Authorization: store['token']}
    });
    emit('finished');
    alert(`${props.title} 상세정보 업데이트가 완료되었습니다.`);
    close();
  } catch (error) {
    api.handleHttpError(error, null, (msg) => {
      alert(msg);
    });
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
