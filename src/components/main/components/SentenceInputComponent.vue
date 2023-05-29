<template>
  <v-card class="sentence_input_card" elevation="3">
    <v-card-title class="sentence_input_card_title">
      오늘 기분이 어떤가요?
    </v-card-title>
    <v-card-subtitle>
      NLP AI 엔진이 당신의 기분에 맞춘 음악을 들려드려요.
    </v-card-subtitle>
    <v-card-text>
      <v-text-field class="sentence_input_text_field" label="문장 입력" placeholder="오늘의 기분을 입력하세요..!"
                    variant="outlined"
                    hint="영문 또는 한글 문장만 가능합니다 (언어 자동 감지 / 한영 혼용 불가)"
                    :error-messages="input.errMsg"
                    @update:modelValue="(sentence) => input.sentence = sentence"
      >
      </v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn class="input_btn" variant="outlined" @click="reqClassification">
        Play Music!
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import {useCredentialStore} from "@/stores/credential/credentialStore";
import {reactive, defineEmits} from "vue";
import axios from 'axios';
import api from '@/components/common/utils/httpUtil';

const store = useCredentialStore();
const emit = defineEmits(['classify'])
const input = reactive({
  sentence: '',
  errMsg: '',
});

async function reqClassification() {
  emit('classify')
  // if (store[''])
  // try {
  //   const response = await axios.post(`${api.SERVER_URL}/users/auths/login`, {
  //     email: input.email,
  //     password: input.password,
  //   });
  //   if (response.data['profile']['verified']) {
  //     store['token'] = `Bearer ${response.data['token']}`;
  //     store['profile'] = response.data['profile'];
  //     await router.push('/places');
  //   } else {
  //     alert('로그인을 해주세요!');
  //   }
  // } catch (error) {
  //   if (error.name === 'AxiosError') {
  //     input.errMsg = error.response.status === 400 ?
  //         "이메일 또는 비밀번호가 잘못되었습니다" : input.errMsg = error.message;
  //   } else {
  //     console.log(error);
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sentence_input_card {
  width: calc(100% - 50px);
  max-width: 800px;
  margin: 25px auto;
}
.sentence_input_card_title {
  font-weight: bold;
}
.sentence_input_text_field {
  max-width: 600px;
  margin: 0 auto;
}
.input_btn {
  width: 200px;
  margin: 0 auto;
}
</style>
