<template>
  <trans-tab-modal
      :title="`${props.title} 등록`"
      :open="isOpen"
      :execute="isExecuting"
      :tab-idx="tabIdx"
      :complete="isComplete"
      @prev="prevStep"
      @next="nextStep"
      @execute="executeStep"
      @input="onClose"
  >
    <template v-slot:common>
      <slot name="common" :setCommonDTO="setCommonDTO"></slot>
    </template>
    <template v-slot:detail>
      <slot name="detail" :setDetailDTO="setDetailDTO"></slot>
    </template>
    <template v-slot:option>
      <slot name="option"></slot>
    </template>
    <template v-slot:register>
      <progress-component
          :progress="progress"
          :proc-msg="procMsg"
          :entity-name="props.title"
      ></progress-component>
    </template>
  </trans-tab-modal>
</template>

<script setup>
import {defineProps, defineEmits, reactive, ref, toRaw, watch} from "vue";
import router from '@/plugins/route';
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import TransTabModal from "@/components/common/modals/TransTabModal";
import ProgressComponent from '@/components/common/components/ProgressComponent';


const store = useCredentialStore();
const emit = defineEmits(['checkCommon', 'checkDetail']);
const props = defineProps({
    open: Boolean, title: String, entityField: String, endpoint: String, idKey: String, noImage: Boolean, singleImage: Boolean, imageWithParam: Boolean, extraJob: Object,
});
let isOpen = ref(props.open);
let isExecuting = ref(false);
let isComplete = ref(false);
let tabIdx = ref(0);
let progress = ref(0);
let procMsg = reactive(['', '', '', '']);
const requestDTO = reactive({
    common: null,
    detail: null,
    option: null,
    image: null,
    images: null,
    imgObjects: null,
});

watch(() => props.open, () => {isOpen.value = props.open});
function setCommonDTO(commonEntity) {
    requestDTO.common = toRaw(commonEntity);
}
function setDetailDTO(detailEntity) {
    requestDTO.detail = toRaw(detailEntity);
}

function prevStep() {
    tabIdx.value--;
}

async function nextStep() {
    if (tabIdx.value === 0) {
        await emit('checkCommon', () => {tabIdx.value++});
    } else if (tabIdx.value === 1) {
        await emit('checkDetail', () => {tabIdx.value++});
    }
}
async function executeStep() {
    isExecuting.value = true;
    tabIdx.value = 3;
    await reqCreateEntity();
}
async function reqCreateEntity() {
    const entity = toRaw(requestDTO.common);
    console.log(entity);
    try {
        const response = await axios.post(`${api.SERVER_URL}/${props.endpoint}/profiles`, entity, {
            headers: {Authorization: store['token']}
        });
        const entityId = response.data[props.entityField]['id'];
        progress.value = 25;
        procMsg.splice(0, 1, `${props.title} 기본 정보 등록 성공`);
        await reqCreateEntityDetail(entityId);
    } catch (error) {
        progress.value = 10;
        handleHttpError(error, 0);
    }
}
async function reqCreateEntityDetail(entityId) {
    const entityDetail = toRaw(requestDTO.detail);
    entityDetail[props.idKey] = entityId;
    console.log(entityDetail);
    try {
        await axios.post(`${api.SERVER_URL}/${props.endpoint}/details`, entityDetail, {
            headers: {Authorization: store['token']}
        });
        progress.value = 50;
        procMsg.splice(1, 1, `${props.title} 상세 정보 등록 성공`);
        await reqGenerateEntityTranslation(entityId, entityDetail['author'], entityDetail['translator']);
    } catch (error) {
        progress.value = 30;
        handleHttpError(error, 1);
    }
}
async function reqGenerateEntityTranslation(entityId, author, translator) {
    let generateDTO = {
        languages: ["en", "ja", "de", "fr", "es", "zh-CN"],
    };
    generateDTO[props.idKey] = entityId;
    console.log(generateDTO);
    
    try {
        await axios.post(`${api.SERVER_URL}/${props.endpoint}/details/generate`, generateDTO, {
            headers: {Authorization: store['token']}
        });
        progress.value = 75;
        procMsg.splice(2, 1, `${props.title} 상세정보 자동번역 성공`);
        if (props.noImage) {
            progress.value = 100;
            isComplete.value = true;
        } else {
            await reqUploadEntityImage(entityId, author, translator);
        }
    } catch (error) {
        progress.value = 60;
        handleHttpError(error, 2);
    }
}
async function reqUploadEntityImage(entityId, author, translator) {
    const formData = new FormData;
    formData.append(props.idKey, Number(entityId));
    formData.append('author', author);
    formData.append('translator', translator);

    if (props.singleImage) {
        const image = toRaw(requestDTO.image);
        formData.append('overwrite', true);
        formData.append('file', image);
    } else if (props.imageWithParam) {
        const imgObjects = toRaw(requestDTO.imgObjects);
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
        const images = toRaw(requestDTO.images);
        images.forEach((img) => {
            formData.append('files', img);
        });
    }
    console.log(formData);
    try {
        if (props.extraJob) {
            procMsg.splice(2, 1, `자동번역 성공 / 추가작업: ${props.extraJob['title']}`);
        }
        await axios.post(`${api.SERVER_URL}/${props.endpoint}/details/images`, formData, {
            headers: {Authorization: store['token'], 'Request-Type': 'BULK'},
        });
        if (props.extraJob) {
            await props.extraJob.execute(entityId);
            procMsg.splice(3, 1, `${props.title} 이미지 업로드 성공 / ${props.extraJob['title']} 성공`);
        } else {
            procMsg.splice(3, 1, `${props.title} 이미지 업로드 성공`);
        }
        progress.value = 100;
        isComplete.value = true;
    } catch (error) {
        progress.value = 80;
        handleHttpError(error, 3);
    }
}
function handleHttpError(error, index) {
    isComplete.value = true;
    api.handleHttpError(error, () => {
        router.push('/');
    }, (message) => {
        procMsg.splice(index, 1, message);
    });
}
function onClose(status) {
    isOpen.value = status;
    tabIdx.value = 0;
    isExecuting.value = false;
    isComplete.value = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
