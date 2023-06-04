<template>
  <common-modal
      :title="`${props.title} 상세정보 등록`"
      :width="700"
      :open="isOpen"
      @input="close"
  >
    <template v-slot:contents>
      <v-form ref="form">
        <v-row>
          <v-col md="12" class="language_select">
            <v-select
                attach
                :label="`${props.title} 번역 목적 언어`"
                variant="outlined"
                :rules="targetLanguageRules"
                v-model="targetLanguage"
                :items="availableLanguage"
                density="compact"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
      <slot name="contents" :setDetailDTO="setDetailDTO" :language="targetLanguage"></slot>
    </template>
    <template v-slot:buttons>
      <v-spacer></v-spacer>
      <v-btn @click="save" variant="text" color="green">등록</v-btn>
      <v-btn @click="close" variant="text">취소</v-btn>
    </template>
  </common-modal>
</template>

<script setup>
import {defineProps, defineEmits, ref, toRaw, watch} from "vue";
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import CommonModal from "@/components/common/modals/CommonModal";
import {useCredentialStore} from "@/stores/credential/credentialStore";

const emit = defineEmits(['input', 'finished', 'check']);
const props = defineProps({open: Boolean, title: String, endpoint: String, idKey: String, detailIdKey: String, entityKey: String, entityId: String, availableLanguage:Array, noImage:Boolean, singleImage:Boolean, imageWithParam:Boolean});
const store = useCredentialStore();
const createDetailEntityDTO = ref(null);
const uploadImage = ref(null);
const uploadImages = ref(null);
const uploadImgObjects = ref(null);
const form = ref(null);
let targetLanguage = ref('');
let availableLanguage = ref(props.availableLanguage);
let isOpen = ref(props.open);

watch(() => props.open, () => {
    isOpen.value = props.open;
    if (props.open && availableLanguage.value.length === 0) {
        alert('모든 언어로 번역이 완료되었습니다.');
        close();
        availableLanguage.value = [];
    }
});
watch(() => props.availableLanguage,() => {
    if (!props.availableLanguage || props.availableLanguage.length === 0) {
        availableLanguage.value = [];
    } else {
        availableLanguage.value = props.availableLanguage;
    }
});

function setDetailDTO(detailDTO) {
    createDetailEntityDTO.value = detailDTO;
}

async function save() {
    const langValid = await form.value.validate();
    if (langValid.valid) {
        emit('check', async () => {await reqCreateEntityDetail()});
    }
}

async function reqCreateEntityDetail() {
    createDetailEntityDTO.value[props.idKey] = props.entityId;
    createDetailEntityDTO.value['language'] = targetLanguage.value;
    console.log(toRaw(createDetailEntityDTO.value));
    try {
        const response = await axios.post(`${api.SERVER_URL}/${props.endpoint}/details`, toRaw(createDetailEntityDTO.value), {
            headers: {Authorization: store['token']}
        });
        if (props.noImage) {
            emit('finished');
            alert(`${props.title} 상세정보 신규 등록이 완료되었습니다.`);
            close();
        }
        const detailId = response.data[props.entityKey]['id'];
        await reqUploadEntityImage(detailId);
    } catch (error) {
        api.handleHttpError(error, null, (msg) => {
            alert(msg);
        });
    }
}

async function reqUploadEntityImage(detailId) {
    const formData = new FormData;
    formData.append(props.detailIdKey, Number(detailId));
    formData.append('author', createDetailEntityDTO.value['author']);
    formData.append('translator', createDetailEntityDTO.value['translator']);

    if (props.singleImage) {
        const image = toRaw(uploadImage.value);
        formData.append('overwrite', true);
        formData.append('file', image);
    } else if (props.imageWithParam) {
        const imgObjects = toRaw(uploadImgObjects.value);
        for (let imgObj of imgObjects) {
            formData.append('files', imgObj['file'][0]);
            // Add additional parameters
            for (const key in imgObj) {
                if (key !== 'files') {
                    formData.append(key, imgObj[key]);
                }
            }
        }
    } else {
        const images = toRaw(uploadImages.value);
        images.forEach((img) => {
            formData.append('files', img);
        });
    }
    console.log(formData);
    try {
        await axios.post(`${api.SERVER_URL}/${props.endpoint}/details/images`, formData, {
            headers: {Authorization: store['token'], 'Request-Type': 'SINGLE'},
        });
        emit('finished');
        alert(`${props.title} 상세정보 신규 등록이 완료되었습니다.`);
        close();
    } catch (error) {
        api.handleHttpError(error, null, (msg) => {
            alert(msg);
        });
    }
}

function close() {
    isOpen.value = false;
    targetLanguage.value = '';
    emit('input', false);
}

const targetLanguageRules = [
    (lang) => (props.availableLanguage.includes(lang) ? true : '언어가 선택되지 않았습니다.'),
]
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.language_select {
    padding-left: 20px;
    padding-right: 20px;
}
</style>
