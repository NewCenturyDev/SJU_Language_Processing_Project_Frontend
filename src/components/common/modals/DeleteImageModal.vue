<template>
  <common-modal
      :title="`${entityName} 이미지 삭제`"
      :open="isOpen"
      :width="500"
      @input="cancel"
  >
    <template v-slot:contents>
      <v-row>
        <h5>{{entityName}} 이미지를 삭제하시겠습니까?</h5>
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
const props = defineProps({open: Boolean, entityName: String, endpoint: String, image: Object});
const emit = defineEmits(['input', 'confirmed']);
let isOpen = ref(props.open);
let image = ref(props.image);

watch(() => props.open, () => {isOpen.value = props.open});
watch(() => props.image, () => {image.value = props.image});

async function confirm() {
  try {
    await axios.delete(`${api.SERVER_URL}${props.endpoint}`, {
      params: {
        id: image.value['id'],
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
.delete_warn_msg {
  padding-top: 10px;
  color: red;
}
</style>
