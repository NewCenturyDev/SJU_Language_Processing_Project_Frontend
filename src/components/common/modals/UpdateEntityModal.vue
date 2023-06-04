<template>
  <common-modal
      :title="`${props.title} 기본정보 수정`"
      :width="700"
      :open="isOpen"
      @input="close"
  >
    <template v-slot:contents>
      <slot name="contents" :setCommonDTO="setCommonDTO"></slot>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="save" variant="text" color="secondary">저장</v-btn>
      <v-btn @click="close" variant="text">취소</v-btn>
    </template>
  </common-modal>
</template>
<script setup>
import {defineProps, defineEmits, ref, toRaw, watch} from "vue";
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import CommonModal from "@/components/common/modals/CommonModal";
import {useCredentialStore} from "@/stores/credential/credentialStore";

const emit = defineEmits(['input', 'finished']);
const props = defineProps({open: Boolean, entityId: String, title: String, endpoint: String});
const store = useCredentialStore();
const updateEntityDTO = ref(null);
let isOpen = ref(props.open);


watch(() => props.open, () => {isOpen.value = props.open;});

function setCommonDTO(commonEntity) {
    updateEntityDTO.value = commonEntity;
}

async function save() {
    await emit('check', async () => {await reqUpdateExhibition()});
}

async function reqUpdateExhibition() {
    updateEntityDTO.value['id'] = props.entityId;
    console.log(toRaw(updateEntityDTO.value));
    try {
        await axios.put(`${api.SERVER_URL}/${props.endpoint}/profiles`, toRaw(updateEntityDTO.value), {
            headers: {Authorization: store['token']}
        });
        emit('finished');
        alert(`${props.title} 기본정보 업데이트가 완료되었습니다.`);
        close();
    } catch (error) {
        api.handleHttpError(error);
    }
}

function close() {
    isOpen.value = false;
    emit('input', false);
}

</script>
