<template>
  <common-modal
    :title="`${entityName} 삭제`"
    :open="isOpen"
    :width="500"
    @input="cancel"
  >
    <template v-slot:contents>
      <v-row>
        <h5>{{entityName}} 정보를 삭제하시겠습니까?</h5>
      </v-row>
      <v-row>
        <h5>대상 {{entityName}}: {{props.entity['text']}}</h5>
      </v-row>
      <v-row>
        <p class="delete_msg">
          {{ entityName }} 삭제시 관련한 모든 정보가 삭제됩니다.<br/>
        </p>
      </v-row>
      <v-row>
        <h5 class="delete_warn_msg">이 작업은 되돌릴 수 없습니다.</h5>
      </v-row>
    </template>
    <template v-slot:buttons>
      <v-btn color="error" @click="confirm">삭제</v-btn>
      <v-btn @click="cancel">취소</v-btn>
    </template>
  </common-modal>
</template>
<script setup>
import {defineProps, defineEmits, ref, watch} from "vue";
import axios from "axios";
import api from "@/components/common/utils/httpUtil";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import CommonModal from "@/components/common/modals/CommonModal";

const store = useCredentialStore();
const props = defineProps({open: Boolean, entityName: String, endpoint: String, entity: Object});
const emit = defineEmits(['input', 'confirmed']);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open});

async function confirm() {
  try {
    await axios.delete(`${api.SERVER_URL}${props.endpoint}`, {
      params: {
        id: props.entity['id'],
      },
      headers: {Authorization: store['token'], 'Request-type': 'ID'}
    });
    emit('confirmed');
    cancel()
  } catch (error) {
    if (error.name === 'AxiosError' && error.response.data['_metadata']) {
      alert(error.response.data['_metadata']['message']);
    } else {
      console.log(error);
    }
  }
}
function cancel() {
  isOpen.value = false;
  emit('input', false);
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.delete_msg {
  font-size: 12px;
  word-break: keep-all;
  padding-top: 10px;
}
.delete_warn_msg {
  padding-top: 10px;
  color: red;
}
</style>
