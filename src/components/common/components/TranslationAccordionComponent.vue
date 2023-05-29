<template>
  <v-row>
    <v-expansion-panels variant="popout">
      <v-expansion-panel title="원본 (한국어)">
        <v-expansion-panel-text>
          <div v-if="isOriginalExist">
            <slot name="original" :openUpdate="openDetailUpdateModal" :openDelete="openDetailDeleteModal"></slot>
          </div>
          <div v-else>
            <v-row>
              <v-col md="12">
                <h5>{{ props.entityLabel }} 원본 (한국어) 상세정보가 손실되었거나 없습니다.</h5>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-btn @click="openDetailCreateModal" variant="outlined" color="green">{{ props.entityLabel }} 상세정보 등록</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :title="`번역본 (언어: ${detail['language']})`" v-for="detail in translatedDetails" :key="detail.id">
        <v-expansion-panel-text>
          <slot name="translation" :detail="detail" :openUpdate="openDetailUpdateModal" :openDelete="openDetailDeleteModal"></slot>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
  <slot name="create-modal" :open="createDetailModalIsOpen" :toggle="toggleCreateModal" :supportedLang="supportedLang"></slot>
  <slot name="update-modal" :open="updateDetailModalIsOpen" :toggle="toggleUpdateModal" :target="targetDetail"></slot>
  <slot name="delete-modal" :open="deleteDetailModalIsOpen" :toggle="toggleDeleteModal" :target="targetDetail"></slot>
</template>


<script setup>
import {defineProps, ref, defineExpose} from 'vue';


const props = defineProps({entityLabel: String, isOriginalExist: Boolean, translatedDetails: Array});
const supportedLang = ['ko', 'en', 'ja', 'de', 'fr', 'es', 'zh-cn', 'pt', 'it', 'ru']
let createDetailModalIsOpen = ref(false);
let updateDetailModalIsOpen = ref(false);
let deleteDetailModalIsOpen = ref(false);
let targetDetail = ref(null);

defineExpose({openDetailCreateModal});

function toggleCreateModal(status) {
  createDetailModalIsOpen.value = status;
}
function toggleUpdateModal(status) {
  updateDetailModalIsOpen.value = status;
}
function toggleDeleteModal(status) {
  deleteDetailModalIsOpen.value = status ? status : false;
}
function openDetailCreateModal() {
  createDetailModalIsOpen.value = true;
}
function openDetailUpdateModal(detail) {
  targetDetail.value = detail;
  updateDetailModalIsOpen.value = true;
}
function openDetailDeleteModal(detail) {
  targetDetail.value = detail;
  console.log(targetDetail.value);
  deleteDetailModalIsOpen.value = true;
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
