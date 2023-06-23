<template>
  <v-card class="input_sentence_card" elevation="3">
    <v-card-title class="input_sentence_title">
      사용자로부터 입력된 문장 목록 (이용 로그)
    </v-card-title>
    <v-card-text class="input_sentence_card_body">
      <v-row class="mt-2">
        <v-spacer></v-spacer>
        <v-col md="2">
          <v-select hide-details
              v-model="fetchOption" label="필터" density="compact" variant="outlined"
              :items="[
              {title: '전체', value: 'ALL_PAGE'},
              {title: '감정분류별', value: 'CATEGORY'},
              {title: '음악별', value: 'MUSIC_ID'},
              {title: '입력일시별 (범위)', value: 'TIME_RANGE'},
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
        <v-btn class="search_btn" @click="reqInputSentences" prepend-icon="mdi-refresh" variant="outlined" color="secondary">조회</v-btn>
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
        <v-col md="4" v-if="fetchOption === 'MUSIC_ID'">
          <v-text-field
              v-model="fetchMusicId"
              label="음악 번호 (PK)" density="compact" variant="outlined"
              hint="고유번호 입력시, 해당 음악이 송출된 건만 필터링 / 공란은 미송출">
          </v-text-field>
        </v-col>
        <v-col md="3" v-if="fetchOption === 'TIME_RANGE'">
          <v-text-field
              v-model="fetchTimeFrom"
              label="조회 시작일자" density="compact" variant="outlined"
              hint="YYYY-MM-DDThh:mm 양식으로 입력 (예시: 2023-06-21T12:30) / 최대 90일">
          </v-text-field>
        </v-col>
        <v-col md="3" v-if="fetchOption === 'TIME_RANGE'">
          <v-text-field
              v-model="fetchTimeTo"
              label="조회 종료일자 (선택)" density="compact" variant="outlined"
              hint="YYYY-MM-DDThh:mm 양식으로 입력 / 최대 90일 / 공란은 현재시각 취급">
          </v-text-field>
        </v-col>
      </v-row>
      <v-table class="input_sentence_table" fixed-header="true" density="compact">
        <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">분류 결과</th>
          <th class="text-left">입력 내용</th>
          <th class="text-left">입력 일시</th>
          <th class="text-left">회원 이메일</th>
          <th class="text-left">회원 번호</th>
          <th class="text-left">음악 번호</th>
          <th class="text-left">추가 학습</th>
          <th class="text-left">기록 삭제</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="sentences.length === 0">
          <td colspan="7">사용 기록이 없습니다.</td>
        </tr>
        <tr
            v-for="sentence in sentences"
            :key="sentence.id"
        >
          <td>{{ sentence['id'] }}</td>
          <td>{{ parseCategory(sentence['category']) }}</td>
          <td>{{ sentence['text'] }}</td>
          <td>{{ sentence['timestamp'].split('.')[0] }}</td>
          <td>{{ sentence['userEmail'] }}</td>
          <td>{{ sentence['userId'] }}</td>
          <td>{{ parseMusic(sentence['music']) }}</td>
          <td>
            <v-btn @click="() => addToTrainData(sentence)" variant="outlined" color="secondary">추가</v-btn>
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
  <delete-entity-modal
      :open="deleteModalIsOpen"
      :entity="deleteTargetSentence"
      entity-name="사용자 입력 기록"
      endpoint="/sentences"
      @input="toggleDeleteModal"
      @confirmed="reqInputSentences"
  >
  </delete-entity-modal>
</template>

<script setup>
import {onBeforeMount, ref, watch} from 'vue';
import axios from 'axios';
import api from "@/components/common/utils/httpUtil";
import {useCredentialStore} from '@/stores/credential/credentialStore';
import DeleteEntityModal from "@/components/common/modals/DeleteEntityModal";


onBeforeMount(reqInputSentences);

const store = useCredentialStore();
const fetchOption = ref('ALL_PAGE');
const fetchPageSize = ref(20);
const fetchCategory = ref('POSITIVE');
const fetchMusicId = ref('');
const fetchTimeFrom = ref('');
const fetchTimeTo = ref('');
const deleteModalIsOpen = ref(false);
const deleteTargetSentence = ref(null);
const pageIdx = ref(1);
const totalPage = ref(0);
const sentences = ref([]);

watch(pageIdx, reqInputSentences);

async function reqInputSentences() {
  try {
    const response = await axios.get(`${api.SERVER_URL}/sentences`, {
      headers: {
        'Authorization': store['token'],
        'Request-Type': fetchOption.value,
      },
      params: {
        category: fetchOption.value === 'CATEGORY' ? fetchCategory.value : null,
        musicId: fetchOption.value === 'MUSIC_ID' ? fetchMusicId.value : null,
        timeRangeFrom: fetchOption.value === 'TIME_RANGE' ? fetchTimeFrom.value : null,
        timeRangeTo: fetchOption.value === 'TIME_RANGE' ? fetchTimeTo.value : null,
        pageIdx: pageIdx.value - 1,
        pageLimit: fetchPageSize.value,
      }
    });
    totalPage.value = response.data['totalPage'];
    sentences.value.splice(0);
    sentences.value = response.data['sentenceInputs'];
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
function parseCategory(category) {
  switch (category) {
    case 'POSITIVE': return `긍정적 (${category})`;
    case 'NEUTRAL': return `중립적 (${category})`;
    case 'NEGATIVE': return `부정적 (${category})`;
    default: return '미분류 (입력오류)';
  }
}
function parseMusic(music) {
  return music ? music['id'] : '미송출';
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search_btn {
  margin-top: 14px;
  margin-bottom: 14px;
  margin-right: 10px;
}
.input_sentence_card {
  margin: 25px;
}
.input_sentence_card_body {
  overflow-x: scroll;
}
.input_sentence_table {
  min-width: 1000px;
}
.input_sentence_table td:nth-child(1), .input_sentence_table th:nth-child(1) {
  width: 50px;
  padding-left: 5px;
  padding-right: 5px;
}
.input_sentence_table td:nth-child(2), .input_sentence_table th:nth-child(2) {
  width: 150px;
  padding-left: 5px;
  padding-right: 5px;
}
.input_sentence_table td:nth-child(4), .input_sentence_table th:nth-child(3) {
  width: 150px;
  padding-left: 5px;
  padding-right: 5px;
}
.input_sentence_table td:nth-child(5), .input_sentence_table th:nth-child(5) {
  width: 200px;
  padding-left: 5px;
  padding-right: 5px;
}
.input_sentence_table td:nth-child(6), .input_sentence_table th:nth-child(6) {
  width: 75px;
  padding-left: 5px;
  padding-right: 5px;
}
.input_sentence_table td:nth-child(7), .input_sentence_table th:nth-child(7) {
  width: 75px;
  padding-left: 5px;
  padding-right: 5px;
}
.input_sentence_table td:nth-child(8), .input_sentence_table th:nth-child(8) {
  width: 60px;
  padding-left: 2px;
  padding-right: 2px;
}
.input_sentence_table td:nth-child(9), .input_sentence_table th:nth-child(9) {
  width: 60px;
  padding-left: 2px;
  padding-right: 2px;
}
</style>
