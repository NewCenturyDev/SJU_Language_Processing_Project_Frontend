<template>
  <common-modal
      :title="`${entityName} 자동 번역 프로시저 실행`"
      :width="700"
      :open="isOpen"
      :persist="true"
      @input="close"
      :disabled="true"
  >
    <template v-slot:contents>
      <v-container class="wrapper">
        <div v-if="isExecuting">
          <v-row>
            <v-col md="12">
              <h5>{{ props.entityName }} - 자동 번역 중입니다...</h5>
              <h5>(자주 사용하지 않는 단어나 오타가 포함되거나, 내용이 길면 오랜 시간이 소요될 수 있습니다.)</h5>
            </v-col>
          </v-row>
          <v-row class="wait_msg">
            <v-progress-circular indeterminate></v-progress-circular>
            <h5>잠시만 기다려 주십시오...</h5>
          </v-row>
        </div>
        <div v-else>
          <v-row>
            <v-col md="12">
              <h5>번역 대상 언어 선택</h5>
              <h5>주의사항: 한국어 상세정보(ko)를 기준으로 번역이 진행되며, 알파벳 특성상 길이가 많이 늘어남으로, 원본 입력시 글자수 제한의 절반 이하로 입력하시길 권장드립니다.</h5>
              <h5>작업이 실패한 경우 수동으로 추가하시거나, 길이를 줄여서 다시 시도해주시기 바랍니다.</h5>
              <h5>작업 수행시 기존 데이터는 덮어쓰기 됩니다.</h5>
            </v-col>
          </v-row>
          <v-row>
            <v-checkbox
                v-model="targetLanguage"
                label="영어"
                value="en"
            ></v-checkbox>
            <v-checkbox
                v-model="targetLanguage"
                label="일본어"
                value="ja"
            ></v-checkbox>
            <v-checkbox
                v-model="targetLanguage"
                label="독일어"
                value="de"
            ></v-checkbox>
            <v-checkbox
                v-model="targetLanguage"
                label="프랑스어"
                value="fr"
            ></v-checkbox>
          </v-row>
          <v-row>
            <v-checkbox
                v-model="targetLanguage"
                label="스페인어"
                value="es"
            ></v-checkbox>
            <v-checkbox
                v-model="targetLanguage"
                label="중국어 (간체)"
                value="zh-CN"
            ></v-checkbox>
            <v-checkbox
                v-model="targetLanguage"
                label="이탈리아어"
                value="it"
            ></v-checkbox>
            <v-checkbox
                v-model="targetLanguage"
                label="러시아어"
                value="ru"
            ></v-checkbox>
          </v-row>
          <v-row>
            <v-checkbox
                v-model="targetLanguage"
                label="포르투갈어"
                value="pt"
            ></v-checkbox>
            <v-checkbox
                v-model="targetLanguage"
                label="베트남어"
                value="vi"
            ></v-checkbox>
          </v-row>
        </div>
      </v-container>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn v-if="!isExecuting" color="secondary" variant="text" @click="reqGenerateTranslation">자동 번역 수행</v-btn>
      <v-btn v-if="!isExecuting" variant="text" @click="close">취소</v-btn>
    </template>
  </common-modal>
</template>

<script setup>
import {ref, defineProps, watch, defineEmits} from 'vue';
import CommonModal from "@/components/common/modals/CommonModal";
import axios from "axios";
import api from "@/components/common/utils/httpUtil";
import {useCredentialStore} from "@/stores/credential/credentialStore";

const store = useCredentialStore();
const emit = defineEmits(['input', 'finished']);
const props = defineProps({idKey: String, idValue: Number, entityName: String, endpoint: String, open: Boolean});
let isExecuting = ref(false);
let targetLanguage = ref([]);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open});


async function reqGenerateTranslation() {
  if (targetLanguage.value.length > 0) {
    isExecuting.value = true;
    let generateDTO = {
      languages: targetLanguage.value,
    };
    generateDTO[props.idKey] = props.idValue;
    console.log(generateDTO);
    try {
      await axios.post(`${api.SERVER_URL}${props.endpoint}`, generateDTO, {
        headers: {Authorization: store['token']},
      });
      emit('finished');
      alert(`${props.entityName} 자동 번역에 성공했습니다.`)
      close();
    } catch (error) {
      api.handleHttpError(error);
      close();
    }
  } else {
    alert('한 개 이상의 대상 언어를 선택하십시오');
  }
}

function close() {
  isOpen.value = false;
  isExecuting.value = false;
  emit('input', false);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wait_msg {
  align-items: center;
}
.wait_msg > h5 {
  margin-left: 20px;
}
.wrapper {
  max-width: 100%;
}
</style>