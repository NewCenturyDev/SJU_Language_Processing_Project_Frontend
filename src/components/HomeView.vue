<template>
  <v-layout>
    <header-fragment></header-fragment>
    <v-main>
      <v-card class="ui_login_card" elevation="3">
        <v-card-title class="ui_login_card_title">
          관리자 콘솔 로그인
        </v-card-title>
        <v-card-text>
          <v-text-field class="ui_login_text_field" label="이메일" placeholder="example@email.com"
                        variant="outlined"
                        :error-messages="input.errMsg"
                        @update:modelValue="(email) => input.email = email"
          >
          </v-text-field>
          <v-text-field class="ui_login_text_field" label="비밀번호" placeholder="password"
                        variant="outlined" type="password"
                        :error-messages="input.errMsg"
                        @update:modelValue="(password) => input.password = password"
                        @keyup.enter="reqLogin"
          ></v-text-field>
          <v-btn variant="outlined" width="100%" @click="reqLogin">
            로그인
          </v-btn>
          <v-row class="mt-1">
            <v-col md="6">
              <v-btn
                  variant="outlined"
                  width="100%"
                  @click="openRegisterModal"
                  @input="toggleRegisterModal"
              >
                회원가입
              </v-btn>
            </v-col>
            <v-col md="6">
              <v-btn
                  variant="outlined"
                  width="100%"
                  @click="openRecoverModal"
                  @input="toggleRecoverModal"
              >
                PW 찾기
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <create-profile-modal
          :open="registerModalIsOpen"
          @input="toggleRegisterModal"
      ></create-profile-modal>
      <recover-password-modal
          :open="pwRecoverModalIsOpen"
          @input="toggleRecoverModal"
      ></recover-password-modal>
    </v-main>
  </v-layout>
</template>

<script setup>
import HeaderFragment from '@/components/common/components/HeaderFragment';
import {reactive, ref} from 'vue';
import router from '@/plugins/route';
import axios from 'axios';
import api from '@/components/common/utils/httpUtil';
import {useCredentialStore} from '@/stores/credential/credentialStore';
import CreateProfileModal from "@/components/mypages/modals/CreateProfileModal.vue";
import RecoverPasswordModal from "@/components/mypages/modals/RecoverPasswordModal.vue";


const store = useCredentialStore();
let registerModalIsOpen = ref(false);
let pwRecoverModalIsOpen = ref(false);
let input = reactive({
  email: '',
  password: '',
  errMsg: '',
});

function toggleRegisterModal(status) {
  registerModalIsOpen.value = status;
}
function toggleRecoverModal(status) {
  pwRecoverModalIsOpen.value = status ? status : false;
}
function openRegisterModal() {
  registerModalIsOpen.value = true;
}
function openRecoverModal() {
  pwRecoverModalIsOpen.value = true;
}

async function reqLogin() {
  try {
    const response = await axios.post(`${api.SERVER_URL}/users/auths/login`, {
      email: input.email,
      password: input.password,
    });
    if (response.data['profile']['verified']) {
      store['token'] = `Bearer ${response.data['token']}`;
      store['profile'] = response.data['profile'];
      await router.push('/places');
    } else {
      alert('최고관리자의 승인을 받지 못한 관리자 계정입니다. 사용승인을 받은 후 다시 로그인하시기 바랍니다.\n관련문의: 02-0000-0000');
    }
  } catch (error) {
    if (error.name === 'AxiosError') {
      input.errMsg = error.response.status === 400 ?
          "이메일 또는 비밀번호가 잘못되었습니다" : input.errMsg = error.message;
    } else {
      console.log(error);
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ui_login_card {
  width: 500px;
  margin: 25px auto;
}
.ui_login_card_title {
  font-weight: bold;
}
.ui_login_text_field {
  padding-bottom: 10px;
}
</style>
