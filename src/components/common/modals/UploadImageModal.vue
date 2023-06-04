<template>
  <common-modal
      :title="`${entityName} 이미지 업로드`"
      :width="700"
      :open="isOpen"
      :persist="true"
      @input="close"
  >
    <template v-slot:contents>
      <v-form ref="form">
        <v-row>
          <v-col md="12">
            <v-file-input :multiple="!isSingle" show-size chips
                          @update:modelValue="setImg"
                          :rules="imageRules"
                          accept="image/png, image/jpeg, image/gif"
                          :placeholder="isSingle ? '이미지 파일(.jpg/.jpeg/.png/.gif - 최대 2MB - 1장만 가능)': '이미지 파일(.jpg/.jpeg/.png/.gif - 1장당 최대 2MB)'"
                          variant="outlined"
                          prepend-icon="mdi-camera"
                          :label="`${props.entityName} 이미지`"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="reqUploadImage" variant="text" color="secondary">저장</v-btn>
      <v-btn @click="close" variant="text">취소</v-btn>
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
const props = defineProps({idKey: String, idValue: Number, author: String, translator:String, entityName: String, endpoint: String, open: Boolean, uploadOption: String, isSingle: Boolean, overwrite: Boolean});
const store = useCredentialStore();
const images = ref([]);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open});

function setImg(files) {
  images.value = files;
}
async function validate() {
  const result = await form.value.validate();
  return result.valid;
}

async function reqUploadImage() {
  if (await validate()) {
    const formData = new FormData;
    formData.append(props.idKey, props.idValue);
    formData.append('author', props.author);
    formData.append('translator', props.translator);
    if (props.isSingle) {
      formData.append('overwrite', props.overwrite);
    }
    images.value.forEach((img) => {
      formData.append(props.isSingle ? 'file' : 'files', img);
    });
    console.log(formData);
    try {
      await axios.post(`${api.SERVER_URL}${props.endpoint}`, formData, {
        headers: {Authorization: store['token'], 'Request-Type': props.uploadOption ? props.uploadOption : 'SINGLE'},
      });
      emit('finished');
      alert(`${props.entityName} 이미지 업로드에 성공했습니다.`)
      close();
    } catch (error) {
      api.handleHttpError(error);
    }
  }
}

function close() {
  isOpen.value = false;
  emit('input', false);
}

const imageRules = [
  value => {return (!value || !value.length) ? `${props.entityName} 이미지를 첨부하십시오` : true},
  value => {
    return !value || !value.length ||value.every(file => file.size < 2000000)
        || `${props.entityName} 이미지는 장당 2MB를 초과할 수 없습니다`;
  }
];
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
