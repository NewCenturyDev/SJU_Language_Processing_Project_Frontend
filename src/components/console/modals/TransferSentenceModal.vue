<template>
  <common-modal
      title="사용자 입력 내용을 학습 데이터에 반영"
      :width="700"
      :open="isOpen"
      @input="close"
  >
    <template v-slot:contents>
      <h5 style="color: red">주의: 학습 데이터에 이관 및 반영시 중복 입력 방지를 위해 해당 사용자 이용 기록은 사라집니다.</h5>
      <train-input-component
          :is-new="true"
          :default-entity="entity"
          :set-entity="setReqDTO"
      ></train-input-component>

      <slot name="contents" :setReqDTO="setReqDTO"></slot>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="reqTransfer" variant="text" color="secondary">저장</v-btn>
      <v-btn @click="close" variant="text">취소</v-btn>
    </template>
  </common-modal>
</template>

<script setup>
import CommonModal from "@/components/common/modals/CommonModal";
import {defineEmits, defineProps, ref, toRaw, watch} from "vue";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import axios from "axios";
import api from "@/components/common/utils/httpUtil";
import TrainInputComponent from "@/components/console/modals/components/TrainInputComponent";

const emit = defineEmits(['input', 'finished']);
const props = defineProps({open: Boolean, entity: Object});
const store = useCredentialStore();
const entityDTO = ref(null);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open;});

function setReqDTO(commonEntity) {
  entityDTO.value = commonEntity;
}

async function reqTransfer() {
  console.log(toRaw(entityDTO.value));
  try {
    await axios.post(`${api.SERVER_URL}/trains`, toRaw(entityDTO.value), {
      headers: {Authorization: store['token']}
    });
    await reqDeleteLog();
    close();
  } catch (error) {
    api.handleHttpError(error);
  }
}

async function reqDeleteLog() {
  try {
    await axios.delete(`${api.SERVER_URL}/sentences?id=${props.entity['id']}`, {
      headers: {Authorization: store['token']}
    });
    emit('finished');
    alert("사용자 입력 문장의 전환이 완료되었습니다.");
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
