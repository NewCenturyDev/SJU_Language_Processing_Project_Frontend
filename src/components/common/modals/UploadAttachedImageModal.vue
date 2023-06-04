<template>
  <common-modal
      :title="`익스히비션 이미지 업로드`"
      :width="700"
      :open="isOpen"
      :persist="true"
      @input="close"
  >
    <template v-slot:contents>
      <v-form ref="form">
        <v-row>
          <h5>
            벌크 업로드 시에는 모든 번역본에 해당 문단 번호가 존재해야 업로드 가능합니다. (하나라도 없을 경우 인덱스 오류 발생)<br/>
            예시: 한국어 원본: 문단 3개, 영어 원본: 문단 2개 -> 이미지 벌크 업로드시 문단 번호는 1,2번만 사용 가능합니다.<br/>
            한국어 원본을 자동번역 하신 후 벌크 업로드를 이용하시거나, 상세정보에서 문단 개수를 맞춘 후 업로드 하시거나,<br/>
            언어별로 문단 개수를 다르게 해야 하는 경우에는, 언어 번역본에서 개별 업로드하시기 바랍니다.
          </h5>
        </v-row>
        <upload-attached-image-component
            ref="attachImgRef"
            :idx-range="props.idxRange"
        ></upload-attached-image-component>
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
import {defineProps, defineEmits, ref, watch,toRaw} from "vue";
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import CommonModal from "@/components/common/modals/CommonModal";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import UploadAttachedImageComponent from "@/components/common/components/UploadAttachedImageComponent";

const form = ref(null);
const emit = defineEmits(['input', 'finished']);
const props = defineProps({idKey: String, idValue: Number, idxRange: Number, author: String, translator:String, open: Boolean, uploadOption: String});
const store = useCredentialStore();
const attachImgRef = ref(null);
let isOpen = ref(props.open);

watch(() => props.open, () => {isOpen.value = props.open});

async function validate() {
  const result = await form.value.validate();
  return result.valid;
}

async function reqUploadImage() {
  if (await validate()) {
    console.log(toRaw(attachImgRef.value.exhibitionImagesWithTag));
    for (let img of toRaw(attachImgRef.value.exhibitionImagesWithTag)) {
      const formData = new FormData;
      formData.append('files', img['file'][0]);
      formData.append(props.idKey, props.idValue);
      formData.append('author', props.author);
      formData.append('translator', props.translator);
      formData.append('taggedContentIdx', img['taggedContentIdx']);
      console.log(formData);
      try {
        await axios.post(`${api.SERVER_URL}/exhibitions/details/images`, formData, {
          headers: {Authorization: store['token'], 'Request-Type': props.uploadOption},
        });
      } catch (error) {
        api.handleHttpError(error, null, (msg) => {
          alert(msg);
        });
        return;
      }
    }
    emit('finished');
    alert('익스히비션 이미지 업로드에 성공했습니다.');
    close();
  }
}

function close() {
  isOpen.value = false;
  emit('input', false);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
