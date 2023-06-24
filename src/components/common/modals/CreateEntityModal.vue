<template>
  <common-modal
      :title="`${props.title} 등록`"
      :width="700"
      :open="isOpen"
      @input="close"
  >
    <template v-slot:contents>
      <slot name="contents" :setEntityDTO="setEntityDTO"></slot>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="save" variant="text" color="green">등록</v-btn>
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

const emit = defineEmits(['input', 'finished', 'check']);
const props = defineProps({open: Boolean, title: String, endpoint: String});
const store = useCredentialStore();
const entityDTO = ref(null);
let isOpen = ref(props.open);

watch(() => props.open, () => {
    isOpen.value = props.open;
});

function setEntityDTO(dto) {
    entityDTO.value = dto;
}

async function save() {
    await emit('check', async () => {await reqCreateEntity()});
}

async function reqCreateEntity() {
    console.log(toRaw(entityDTO.value));
    try {
        await axios.post(`${api.SERVER_URL}${props.endpoint}`, toRaw(entityDTO.value), {
            headers: {Authorization: store['token']}
        });
        emit('finished');
        alert(`${props.title} 신규 등록이 완료되었습니다.`);
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
