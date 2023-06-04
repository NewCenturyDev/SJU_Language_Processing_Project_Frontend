<template>
  <common-modal
      title="회원가입"
      :width="700"
      :open="isOpen"
      @input="close"
  >
    <template v-slot:contents>
      <signup-input
          ref="userInputCommonRef"
          :is-new="true"
          :set-entity="setUserInput"
      ></signup-input>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="reqSignup" variant="text" color="green">등록</v-btn>
      <v-btn @click="close" variant="text">취소</v-btn>
    </template>
  </common-modal>
</template>
<script setup>
import {defineProps, defineEmits, ref, watch, toRaw} from "vue";
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import CommonModal from "@/components/common/modals/CommonModal";
import SignupInput from "@/components/main/modals/components/SignupInput";

const emit = defineEmits(['input', 'finished']);
const props = defineProps({open: Boolean});
let userInputCommonRef = ref(null);
let userInput = ref(null);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open});

function setUserInput(inputCommon) {
  userInput.value = toRaw(inputCommon);
}

async function reqSignup() {
  if (await userInputCommonRef.value.validate()) {
    console.log(toRaw(userInput.value));
    try {
      await axios.post(`${api.SERVER_URL}/users/profiles`, toRaw(userInput.value), {});
      alert('회원 가입이 완료되었습니다.\n(이메일 주소로 로그인하세요)');
      close();
    } catch (error) {
      api.handleHttpError(error, null, (msg) => {
        alert(msg);
      });
    }
  }
}

function close() {
  isOpen.value = false;
  emit('input', false);
}

</script>
