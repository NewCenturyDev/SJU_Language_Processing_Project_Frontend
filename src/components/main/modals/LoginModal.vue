<template>
  <common-modal
      title="로그인"
      :width="500"
      :open="isOpen"
      @input="close"
  >
    <template v-slot:contents>
      <v-text-field class="ui_login_text_field mb-2" label="이메일" placeholder="example@email.com"
                    variant="outlined" density="compact"
                    :error-messages="input.errMsg"
                    @update:modelValue="(email) => input.email = email"
      >
      </v-text-field>
      <v-text-field class="ui_login_text_field mb-2" label="비밀번호" placeholder="password"
                    variant="outlined" density="compact" type="password"
                    :error-messages="input.errMsg"
                    @update:modelValue="(password) => input.password = password"
                    @keyup.enter="reqLogin"
      ></v-text-field>
      <signup-modal
          :open="signupModalIsOpen"
          @input="toggleSignupModal"
      ></signup-modal>
      <v-btn @click="openSignupModal" variant="outlined" density="compact" color="secondary">회원가입</v-btn>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="reqLogin" variant="text" color="secondary">로그인</v-btn>
      <v-btn @click="close" variant="text">취소</v-btn>
    </template>
  </common-modal>
</template>
<script setup>
import {defineProps, defineEmits, ref, watch, reactive} from "vue";
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import CommonModal from "@/components/common/modals/CommonModal";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import SignupModal from "@/components/main/modals/SignupModal";

const emit = defineEmits(['input', 'finished']);
const props = defineProps({open: Boolean});
const store = useCredentialStore();
const signupModalIsOpen = ref(false);
let isOpen = ref(props.open);

let input = reactive({
  email: '',
  password: '',
  errMsg: '',
});

watch(() => props.open, () => {isOpen.value = props.open});

async function reqLogin() {
  try {
    const response = await axios.post(`${api.SERVER_URL}/users/auths/login`, {
      email: input.email,
      password: input.password,
    });
    store['token'] = `Bearer ${response.data['token']}`;
    store['profile'] = response.data['profile'];
    store['loggedIn'] = true;
    emit('finished');
  } catch (error) {
    if (error.name === 'AxiosError') {
      input.errMsg = error.response.status === 400 ?
          "이메일 또는 비밀번호가 잘못되었습니다" : input.errMsg = error.message;
    } else {
      console.log(error);
    }
  }
}

function toggleSignupModal(status) {
  signupModalIsOpen.value = status ? status : false;
}
function openSignupModal() {
  signupModalIsOpen.value = true;
}

function close() {
  isOpen.value = false;
  emit('input', false);
}

</script>
