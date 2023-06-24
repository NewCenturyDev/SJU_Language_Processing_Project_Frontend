<template>
  <v-card class="train_sentence_card" elevation="3">
    <v-card-title class="train_sentence_title">
      학습용 문장 목록 (학습 데이터)
    </v-card-title>
    <v-card-text class="train_sentence_card_body">
      <v-row class="mt-2">
        <v-col md="2">
          <v-btn variant="outlined" color="green" @click="openCreateModal">신규 학습 문장 등록</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col md="2">
          <v-select hide-details
                    v-model="fetchOption" label="필터" density="compact" variant="outlined"
                    :items="[
              {title: '전체', value: 'ALL_PAGE'},
              {title: '감정분류별', value: 'CATEGORY'},
          ]"
                    @update:modelValue="resetFetchOption"
          ></v-select>
        </v-col>
        <v-col md="2">
          <v-select hide-details
                    v-model="fetchPageSize" label="조회 단위" density="compact" variant="outlined"
                    :items="[
              {title: '5개씩', value: 5},
              {title: '10개씩', value: 10},
              {title: '20개씩', value: 20},
              {title: '50개씩', value: 50},
              {title: '100개씩', value: 100},
          ]"
                    @update:modelValue="resetPageIdx"
          ></v-select>
        </v-col>
        <v-btn class="search_btn" @click="reqTrainSentences" prepend-icon="mdi-refresh" variant="outlined" color="secondary">조회</v-btn>
      </v-row>
      <v-row v-if="fetchOption !== 'ALL_PAGE'">
        <v-spacer></v-spacer>
        <v-col md="2" v-if="fetchOption === 'CATEGORY'">
          <v-select
              v-model="fetchCategory" label="카테고리" density="compact" variant="outlined"
              :items="[
              {title: '미분류', value: null},
              {title: '긍정적', value: 'POSITIVE'},
              {title: '중립', value: 'NEUTRAL'},
              {title: '부정적', value: 'NEGATIVE'},
          ]"
          ></v-select>
        </v-col>
      </v-row>
      <v-table class="train_sentence_table" fixed-header="true" density="compact">
        <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">언어</th>
          <th class="text-left">분류 라벨</th>
          <th class="text-left">분류 코드</th>
          <th class="text-left">문장 내용</th>
          <th class="text-left">수정</th>
          <th class="text-left">삭제</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="sentences.length === 0">
          <td colspan="7">학습 데이터가 없습니다.</td>
        </tr>
        <tr
            v-for="sentence in sentences"
            :key="sentence.id"
        >
          <td>{{ sentence['id'] }}</td>
          <td>{{ parseLanguage(sentence['language']) }}</td>
          <td>{{ parseCategory(sentence['category']) }}</td>
          <td>{{ sentence['sentiment'] }}</td>
          <td>{{ sentence['text'] }}</td>
          <td>
            <v-btn @click="() => openUpdateModal(sentence)" variant="outlined" color="secondary">수정</v-btn>
          </td>
          <td>
            <v-btn @click="() => openDeleteModal(sentence)" variant="outlined" color="error">삭제</v-btn>
          </td>
        </tr>
        </tbody>
      </v-table>
      <v-pagination v-model="pageIdx" :length="totalPage"></v-pagination>
    </v-card-text>
  </v-card>
  <create-sentence-modal
      :open="createModalIsOpen"
      @input="toggleCreateModal"
      @finished="reqTrainSentences"
  ></create-sentence-modal>
  <update-sentence-modal
      :open="updateModalIsOpen"
      :sentence="updateTargetSentence"
      @input="toggleUpdateModal"
      @finished="reqTrainSentences"
  ></update-sentence-modal>
  <delete-entity-modal
      :open="deleteModalIsOpen"
      :entity="deleteTargetSentence"
      entity-name="학습 문장 데이터"
      endpoint="/trains"
      @input="toggleDeleteModal"
      @confirmed="reqTrainSentences"
  >
  </delete-entity-modal>
</template>

<script setup>
import {onBeforeMount, ref, watch} from 'vue';
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import {useCredentialStore} from '@/stores/credential/credentialStore';
import DeleteEntityModal from "@/components/common/modals/DeleteEntityModal";
import UpdateSentenceModal from "@/components/console/modals/UpdateSentenceModal";
import CreateSentenceModal from "@/components/console/modals/CreateSentenceModal";


onBeforeMount(reqTrainSentences);

const store = useCredentialStore();
const fetchOption = ref('ALL_PAGE');
const fetchPageSize = ref(20);
const fetchCategory = ref('POSITIVE');
const fetchMusicId = ref('');
const fetchTimeFrom = ref('');
const fetchTimeTo = ref('');
const deleteModalIsOpen = ref(false);
const deleteTargetSentence = ref(null);
const updateModalIsOpen = ref(false);
const updateTargetSentence = ref(null);
const createModalIsOpen = ref(false);
const pageIdx = ref(1);
const totalPage = ref(0);
const sentences = ref([]);

watch(pageIdx, reqTrainSentences);

async function reqTrainSentences() {
  try {
    const response = await axios.get(`${api.SERVER_URL}/trains`, {
      headers: {
        'Authorization': store['token'],
        'Request-Type': fetchOption.value,
      },
      params: {
        category: fetchOption.value === 'CATEGORY' ? fetchCategory.value : null,
        pageIdx: pageIdx.value - 1,
        pageLimit: fetchPageSize.value,
      }
    });
    totalPage.value = response.data['totalPage'];
    sentences.value.splice(0);
    sentences.value = response.data['sentenceTrains'];
  } catch (error) {
    api.handleHttpError(error);
  }
}
function resetFetchOption() {
  pageIdx.value = 1;
  fetchPageSize.value = 20;
  fetchCategory.value = 'POSITIVE';
  fetchMusicId.value = '';
  fetchTimeFrom.value = '';
  fetchTimeTo.value = '';
}
function resetPageIdx() {
  pageIdx.value = 1;
}
function toggleDeleteModal(status) {
  deleteModalIsOpen.value = status ? status : false;
}
function openDeleteModal(sentence) {
  deleteTargetSentence.value = sentence;
  toggleDeleteModal(true);
}
function toggleUpdateModal(status) {
  updateModalIsOpen.value = status ? status : false;
}
function openUpdateModal(sentence) {
  updateTargetSentence.value = sentence;
  toggleUpdateModal(true);
}
function toggleCreateModal(status) {
  createModalIsOpen.value = status ? status : false;
}
function openCreateModal() {
  toggleCreateModal(true);
}
function parseCategory(category) {
  switch (category) {
    case 'POSITIVE': return `긍정적 (${category})`;
    case 'NEUTRAL': return `중립적 (${category})`;
    case 'NEGATIVE': return `부정적 (${category})`;
    default: return '미분류 (입력오류)';
  }
}
function parseLanguage(language) {
  const candidates = {
    "en": "영문 (EN)",
    "ko": "한글 (KO)"
  }
  return candidates[language];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search_btn {
  margin-top: 14px;
  margin-bottom: 14px;
  margin-right: 10px;
}
.train_sentence_card {
  margin: 25px auto;
  max-width: 1500px;
}
.train_sentence_card_body {
  overflow-x: scroll;
}
.train_sentence_table {
  min-width: 1000px;
}
.train_sentence_table td:nth-child(1), .train_sentence_table th:nth-child(1) {
  width: 50px;
  padding-left: 5px;
  padding-right: 5px;
}
.train_sentence_table td:nth-child(2), .train_sentence_table th:nth-child(2) {
  width: 75px;
  padding-left: 5px;
  padding-right: 5px;
}
.train_sentence_table td:nth-child(3), .train_sentence_table th:nth-child(3) {
  width: 150px;
  padding-left: 5px;
  padding-right: 5px;
}
.train_sentence_table td:nth-child(4), .train_sentence_table th:nth-child(5) {
  width: 50px;
  padding-left: 5px;
  padding-right: 5px;
}
.train_sentence_table td:nth-child(5), .train_sentence_table th:nth-child(5) {
  min-width: 550px;
}
.train_sentence_table td:nth-child(6), .train_sentence_table th:nth-child(6) {
  width: 60px;
  padding-left: 2px;
  padding-right: 2px;
}
.train_sentence_table td:nth-child(7), .train_sentence_table th:nth-child(7) {
  width: 60px;
  padding-left: 2px;
  padding-right: 2px;
}
</style>
