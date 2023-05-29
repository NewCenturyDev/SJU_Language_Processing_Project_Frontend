<template>
  <v-row>
    <v-col class="v-col">
      <v-btn class="me-2" @click="appendImg" :disabled="exhibitionImagesWithTag.length === 100" variant="outlined" color="secondary">이미지 추가</v-btn>
      <v-btn @click="removeImg" :disabled="exhibitionImagesWithTag.length === 1" variant="outlined" color="secondary">이미지 제거</v-btn>
    </v-col>
  </v-row>
  <v-row :key="idx" v-for="(img, idx) in exhibitionImagesWithTag">
    <v-col class="v-col" md="9">
      <v-file-input show-size chips
                    @update:modelValue="(imgFile) => setExhibitionImg(idx, imgFile)"
                    :rules="imageRules"
                    accept="image/png, image/jpeg, image/gif"
                    placeholder="이미지 파일(.jpg/.jpeg/.png/.gif - 1장당 최대 2MB)"
                    variant="outlined"
                    prepend-icon="mdi-camera"
                    label="전시물 도슨트 이미지"
      ></v-file-input>
    </v-col>
    <v-col class="v-col" md="3">
      <v-text-field
          v-model="img['taggedContentIdx']"
          :rules="tagIdxRules"
          label="문단 번호"
          variant="outlined"
          density="compact"
          placeholder="태그될 도슨트 문단 번호"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script setup>
import {defineExpose, defineProps, reactive, toRaw} from "vue";


const props = defineProps({idxRange: Number})
const exhibitionImagesWithTag = reactive([{
  file: null,
  taggedContentIdx: null
}]);

defineExpose({exhibitionImagesWithTag});

function appendImg() {
  exhibitionImagesWithTag.push({
    file: null,
    taggedContentIdx: null,
  });
}

function removeImg() {
  exhibitionImagesWithTag.pop();
}

function setExhibitionImg(idx, file) {
  exhibitionImagesWithTag[idx]['file'] = file;
  console.log(toRaw(exhibitionImagesWithTag));
}

const tagIdxRules = [
  value => {return value ? true : '전시물 해설 이미지 태그 문단 번호를 입력하십시오';},
  value => {return 0 < Number(value) && Number(value) <= props.idxRange ? true : '문단 번호가 범위를 벗어났습니다';},
  value => {return Number(value) % 1 === 0 ? true : '문단 번호는 정수 단위여야 합니다';},
];
const imageRules = [
  value => {return (!value || !value.length) ? '전시물 이미지를 첨부하십시오' : true},
  value => {
    return !value || !value.length ||value.every(file => file.size < 2000000)
        || '전시물 이미지는 장당 2MB를 초과할 수 없습니다';
  }
];
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-col {
  padding: 5px !important;
}
</style>
