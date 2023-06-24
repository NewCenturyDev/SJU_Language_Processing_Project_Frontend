<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col class="v-col" md="6">
          <v-text-field
              v-model="entityDTO.title"
              :rules="textRules"
              :counter="5000"
              label="음악 곡명"
              placeholder="100자 이내로 입력하세요"
              variant="outlined"
              density="compact"
          >
          </v-text-field>
        </v-col>
        <v-col class="v-col" md="6">
          <v-select
              attach
              label="분류"
              variant="outlined"
              v-model="entityDTO.category"
              :items="[
                {title: '긍정적', value: 'POSITIVE'},
                {title: '중립', value: 'NEUTRAL'},
                {title: '부정적', value: 'NEGATIVE'},
              ]"
              density="compact"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="v-col" md="6">
          <v-text-field
              v-model="entityDTO.artist"
              :rules="artistRules"
              :counter="50"
              label="아티스트명"
              placeholder="50자 이내로 입력하세요"
              variant="outlined"
              density="compact"
          >
          </v-text-field>
        </v-col>
        <v-col class="v-col" md="6">
          <v-text-field
              v-model="entityDTO.author"
              :rules="authorRules"
              :counter="50"
              label="작곡자명"
              placeholder="50자 이내로 입력하세요"
              variant="outlined"
              density="compact"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="isNew">
        <v-file-input show-size chips="true"
                      @update:modelValue="(audioFile) => setAudioFile(audioFile)"
                      :rules="audioRules"
                      accept="audio/mp3, audio/wav, audio/flac"
                      placeholder="오디오 파일(.mp3/.wav/.flac - 1곡 최대 20MB)"
                      variant="outlined"
                      prepend-icon="mdi-music"
                      label="음악 파일"
        ></v-file-input>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import {reactive, ref, defineProps, defineExpose, watch, toRaw} from "vue";


const props = defineProps({isNew: Boolean, setEntity: Function, defaultEntity: Object});
const form = ref(null);
const entityDTO = reactive({
  file: null,
  title: '',
  author: '',
  artist: '',
  category: 'POSITIVE',
});

console.log(props.isNew);

watch(entityDTO, () => {
  props.setEntity(entityDTO);
});
defineExpose({validate});

if (props.defaultEntity) {
  console.log(props.defaultEntity);
  const defaultValue = ref(props.defaultEntity);
  entityDTO['title'] = defaultValue.value['title'];
  entityDTO['author'] = defaultValue.value['author'];
  entityDTO['artist'] = defaultValue.value['artist'];
  entityDTO['category'] = defaultValue.value['category'];
}

async function validate() {
  const result = await form.value.validate();
  return result.valid;
}

function setAudioFile(file) {
  entityDTO['file'] = file;
  console.log(toRaw(entityDTO));
}

const textRules = [
  value => {return value ? true : '음악 곡명을 입력하십시오';},
  value => {return String(value).length <= 100 ? true : '음악 곡명은 100자를 초과할 수 없습니다';}
];
const artistRules = [
  value => {return value ? true : '아티스트명을 입력하십시오';},
  value => {return String(value).length <= 50 ? true : '아티스트명은 50자를 초과할 수 없습니다';}
];
const authorRules = [
  value => {return value ? true : '작곡자명을 입력하십시오';},
  value => {return String(value).length <= 50 ? true : '작곡자명은 50자를 초과할 수 없습니다';}
];
const audioRules = [
  value => {return (!value || !value.length) ? '오디오 파일을 첨부하십시오' : true},
  value => {
    return !value || !value.length ||value.every(file => file.size < 20000000)
        || '오디오 파일은 1곡 20MB를 초과할 수 없습니다';
  }
];
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-col {
  padding: 5px !important;
}
</style>
