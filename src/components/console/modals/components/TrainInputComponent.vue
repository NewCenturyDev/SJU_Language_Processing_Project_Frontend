<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col class="v-col" md="6">
          <v-select
              attach
              disabled
              label="학습 문장 언어"
              variant="outlined"
              v-model="entityDTO.language"
              :items="[
                {title: '영문', value: 'en'},
                {title: '한글', value: 'ko'},
              ]"
              density="compact"
          ></v-select>
        </v-col>
        <v-col class="v-col" md="6">
          <v-select
              attach
              label="학습 문장 분류 (라벨)"
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
        <v-col class="v-col" md="12">
          <v-text-field
              v-model="entityDTO.text"
              :rules="textRules"
              :counter="5000"
              label="학습 문장 내용"
              placeholder="반드시 일치하는 언어로 입력해야만 합니다."
              variant="outlined"
              density="compact"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import {reactive, ref, defineProps, defineExpose, watch} from "vue";


const props = defineProps({isNew: Boolean, defaultEntity: Object, setEntity: Function});
const form = ref(null);
const entityDTO = reactive({
  language: 'en',
  category: 'POSITIVE',
  text: '',
});

console.log(props.isNew);

watch(entityDTO, () => {
  props.setEntity(entityDTO);
});
defineExpose({validate});

if (props.defaultEntity) {
  console.log(props.defaultEntity);
  const defaultValue = ref(props.defaultEntity);
  entityDTO['language'] = 'en';
  entityDTO['category'] = defaultValue.value['category'];
  entityDTO['text'] = defaultValue.value['text'];
}

async function validate() {
  const result = await form.value.validate();
  return result.valid;
}

const textRules = [
  value => {return value ? true : '학습 문장 내용을 입력하십시오';},
  value => {return String(value).length <= 5000 ? true : '학습 문장 내용은 5000자를 초과할 수 없습니다';}
];
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-col {
  padding: 5px !important;
}
</style>
