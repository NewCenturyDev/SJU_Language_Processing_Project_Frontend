<template>
  <common-modal
      :title="`${entityName} CSV 데이터 업로드`"
      :width="700"
      :open="isOpen"
      :persist="true"
      @input="close"
  >
    <template v-slot:contents>
      <v-form ref="form">
        <v-row>
          <v-col>
            <h3>참고 자료 다운로드</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn class="download_manual_btn" @click="downloadTemplate" disabled color="secondary" variant="outlined" density="compact">CSV 양식</v-btn>
            <v-btn class="download_manual_btn" @click="downloadExample" disabled color="secondary" variant="outlined" density="compact">CSV 작성 예시</v-btn>
            <v-btn class="download_manual_btn" @click="downloadGuideManual" disabled color="secondary" variant="outlined" density="compact">CSV 작성 매뉴얼</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <v-file-input show-size chips
                          @update:modelValue="setCSV"
                          :rules="fileRules"
                          :disabled="isUploaded"
                          accept=".csv"
                          placeholder="CSV 파일(.csv - 엑셀 파일은 CSV 변환 후 이용 - 최대 1MB)"
                          variant="outlined"
                          prepend-icon="mdi-camera"
                          :label="`${props.entityName} 데이터 CSV 파일`"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-form>
      <div v-if="isUploaded">
        <v-row>
          <v-col>
            <h3>{{totalEntryCnt}}개 데이터 중 {{successEntryCnt}}개 불러오기 성공</h3>

          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>실패 사유</h4>
            <h5 v-for="(msg, idx) in failedEntryMessages" :key="idx">CSV {{failedEntryIndices[idx] + 2}}번 라인 {{entityName}}: {{msg}}</h5>
          </v-col>
        </v-row>
      </div>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn v-if="!isUploaded" @click="reqImportEntity" :disabled="isUploaded" variant="text" color="secondary">CSV 데이터 가져오기</v-btn>
      <v-btn v-if="!isUploaded" @click="close" variant="text">취소</v-btn>
      <v-btn v-else @click="emitAndClose" variant="text">닫기</v-btn>
    </template>
  </common-modal>
</template>

<script setup>
import {defineProps, defineEmits, ref, watch} from "vue";
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import CommonModal from "@/components/common/modals/CommonModal";
import {useCredentialStore} from "@/stores/credential/credentialStore";

const form = ref(null);
const emit = defineEmits(['input', 'finished']);
const props = defineProps({entityName: String, endpoint: String, open: Boolean});
const store = useCredentialStore();
const csv = ref(null);
let isOpen = ref(props.open);
let isUploaded = ref(false);
const failedEntryMessages = ref([]);
const failedEntryIndices = ref([]);
const totalEntryCnt = ref(0);
const successEntryCnt = ref(0);


watch(() => props.open, () => {isOpen.value = props.open});

function setCSV(file) {
  csv.value = file[0];
}
async function validate() {
  const result = await form.value.validate();
  return result.valid;
}

async function reqImportEntity() {
  if (await validate()) {
    const formData = new FormData;
    formData.append('csv', csv.value);
    console.log(formData);
    try {
      const response = await axios.post(`${api.SERVER_URL}${props.endpoint}`, formData, {
        headers: {Authorization: store['token']},
      });
      isUploaded.value = true;
      csv.value = null;
      failedEntryIndices.value = response.data['failedIndices'];
      const failedEntryCnt = failedEntryIndices.value.length;
      totalEntryCnt.value = response.data['imported'].length;
      successEntryCnt.value = totalEntryCnt.value - failedEntryCnt;
      failedEntryMessages.value = response.data['failedErrorMsg'];
      if (failedEntryCnt === 0) {
        alert(`${props.entityName} CSV 파일 데이터 가져오기에 성공했습니다.`);
      } else {
        alert(`${response.data['failedIndices'].length} 건의 플레이스 가져오기가 실패하였습니다.\n (다른 데이터는 정상 처리 되었습니다.)`);
      }
    } catch (error) {
      api.handleHttpError(error);
    }
  }
}

function downloadTemplate() {
// TODO:
}

function downloadExample() {

}

function downloadGuideManual() {

}

function close() {
  isOpen.value = false;
  emit('input', false);
}

function emitAndClose() {
  emit('finished');
  close();
}

const fileRules = [
  value => {return (!value || !value.length) ? `${props.entityName} CSV 데이터 파일을 첨부하십시오` : true},
  value => {
    return !value || !value.length ||value.every(file => file.size < 1000000)
        || `${props.entityName} 데이터 파일은 1MB를 초과할 수 없습니다`;
  }
];
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.download_manual_btn {
    margin-right: 5px;
}
</style>
