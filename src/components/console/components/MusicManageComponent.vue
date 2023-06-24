<template>
  <v-card class="music_card">
    <v-card-title>
      음원 목록 (결과에 따라 송출될 음악)
    </v-card-title>
    <v-card-text class="music_card_body">
      <v-row class="mt-2">
        <v-col md="2">
          <v-btn variant="outlined" color="green" @click="openCreateModal">신규 음원 등록</v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col><h3>긍정 카테고리 음악 (빠르기 120bpm 이상)</h3></v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <v-table class="music_table" fixed-header="true" density="compact">
            <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">분류</th>
              <th class="text-left">제목</th>
              <th class="text-left">아티스트</th>
              <th class="text-left">작곡자</th>
              <th class="text-left">듣기</th>
              <th class="text-left">수정</th>
              <th class="text-left">삭제</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="positiveMusics.length === 0">
              <td colspan="7">긍정 카테고리 음악이 없습니다.</td>
            </tr>
            <tr
                v-for="music in positiveMusics"
                :key="music.id"
            >
              <td>{{ music['id'] }}</td>
              <td>{{ parseCategory(music['category']) }}</td>
              <td>{{ music['title'] }}</td>
              <td>{{ music['artist'] }}</td>
              <td>{{ music['author'] }}</td>
              <td>
                <audio controls :src="`${api.SERVER_URL}${music['fileURL']}`"></audio>
              </td>
              <td>
                <v-btn @click="() => openUpdateModal(music)" variant="outlined" color="secondary">수정</v-btn>
              </td>
              <td>
                <v-btn @click="() => openDeleteModal(music)" variant="outlined" color="error">삭제</v-btn>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col><h3>중립 카테고리 음악 (빠르기 90bpm ~ 110bpm)</h3></v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <v-table class="music_table" fixed-header="true" density="compact">
            <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">분류</th>
              <th class="text-left">제목</th>
              <th class="text-left">아티스트</th>
              <th class="text-left">작곡자</th>
              <th class="text-left">듣기</th>
              <th class="text-left">수정</th>
              <th class="text-left">삭제</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="neutralMusics.length === 0">
              <td colspan="7">중립 카테고리 음악이 없습니다.</td>
            </tr>
            <tr
                v-for="music in neutralMusics"
                :key="music.id"
            >
              <td>{{ music['id'] }}</td>
              <td>{{ parseCategory(music['category']) }}</td>
              <td>{{ music['title'] }}</td>
              <td>{{ music['artist'] }}</td>
              <td>{{ music['author'] }}</td>
              <td>
                <audio controls :src="`${api.SERVER_URL}${music['fileURL']}`"></audio>
              </td>
              <td>
                <v-btn @click="() => openUpdateModal(music)" variant="outlined" color="secondary">수정</v-btn>
              </td>
              <td>
                <v-btn @click="() => openDeleteModal(music)" variant="outlined" color="error">삭제</v-btn>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col><h3>부정 카테고리 음악 (빠르기 80bpm 미만)</h3></v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <v-table class="music_table" fixed-header="true" density="compact">
            <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">분류</th>
              <th class="text-left">제목</th>
              <th class="text-left">아티스트</th>
              <th class="text-left">작곡자</th>
              <th class="text-left">듣기</th>
              <th class="text-left">수정</th>
              <th class="text-left">삭제</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="negativeMusics.length === 0">
              <td colspan="7">부정 카테고리 음악이 없습니다.</td>
            </tr>
            <tr
                v-for="music in negativeMusics"
                :key="music.id"
            >
              <td>{{ music['id'] }}</td>
              <td>{{ parseCategory(music['category']) }}</td>
              <td>{{ music['title'] }}</td>
              <td>{{ music['artist'] }}</td>
              <td>{{ music['author'] }}</td>
              <td>
                <audio controls :src="`${api.SERVER_URL}${music['fileURL']}`"></audio>
              </td>
              <td>
                <v-btn @click="() => openUpdateModal(music)" variant="outlined" color="secondary">수정</v-btn>
              </td>
              <td>
                <v-btn @click="() => openDeleteModal(music)" variant="outlined" color="error">삭제</v-btn>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <create-music-modal
      :open="createModalIsOpen"
      @input="toggleCreateModal"
      @finished="reqMusics"
  ></create-music-modal>
  <update-music-modal
      :open="updateModalIsOpen"
      :music="updateTargetMusic"
      @input="toggleUpdateModal"
      @finished="reqMusics"
  ></update-music-modal>
  <delete-entity-modal
      :open="deleteModalIsOpen"
      :entity="deleteTargetMusic"
      entity-name="음악"
      endpoint="/musics"
      @input="toggleDeleteModal"
      @confirmed="reqMusics"
  >
  </delete-entity-modal>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import axios from "axios";
import api from "@/components/common/utils/httpUtil";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import DeleteEntityModal from "@/components/common/modals/DeleteEntityModal";
import CreateMusicModal from "@/components/console/modals/CreateMusicModal";
import UpdateMusicModal from "@/components/console/modals/UpdateMusicModal";

onBeforeMount(reqMusics);

const store = useCredentialStore();
const deleteModalIsOpen = ref(false);
const deleteTargetMusic = ref(null);
const updateModalIsOpen = ref(false);
const updateTargetMusic = ref(null);
const createModalIsOpen = ref(false);
const positiveMusics = ref([]);
const neutralMusics = ref([]);
const negativeMusics = ref([]);

async function reqMusics() {
  await reqMusicsByCategory('POSITIVE');
  await reqMusicsByCategory('NEUTRAL');
  await reqMusicsByCategory('NEGATIVE');
}

async function reqMusicsByCategory(category) {
  try {
    const response = await axios.get(`${api.SERVER_URL}/musics`, {
      headers: {
        'Authorization': store['token'],
      },
      params: { category }
    });
    if (category === 'POSITIVE') {
      positiveMusics.value.splice(0);
      positiveMusics.value = response.data['musics'];
    } else if (category === 'NEUTRAL') {
      neutralMusics.value.splice(0);
      neutralMusics.value = response.data['musics'];
    } else if (category === 'NEGATIVE') {
      negativeMusics.value.splice(0);
      negativeMusics.value = response.data['musics'];
    } else {
      alert('에러 - 잘못된 음악 카테고리');
    }
  } catch (error) {
    api.handleHttpError(error);
  }
}

function toggleDeleteModal(status) {
  deleteModalIsOpen.value = status ? status : false;
}
function openDeleteModal(music) {
  deleteTargetMusic.value = music;
  toggleDeleteModal(true);
}
function toggleUpdateModal(status) {
  updateModalIsOpen.value = status ? status : false;
}
function openUpdateModal(music) {
  updateTargetMusic.value = music;
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.music_card {
  margin: 25px auto;
  max-width: 1500px;
}
.music_card_body {
  overflow-x: scroll;
}
.music_table {
  min-width: 1000px;
}
.music_table td:nth-child(1), .music_table th:nth-child(1) {
  width: 50px;
  padding-left: 5px;
  padding-right: 5px;
}
.music_table td:nth-child(2), .music_table th:nth-child(2) {
  width: 150px;
  padding-left: 5px;
  padding-right: 5px;
}
.music_table td:nth-child(3), .music_table th:nth-child(3) {
  min-width: 550px;
}
.music_table td:nth-child(4), .music_table th:nth-child(4) {
  width: 125px;
  padding-left: 5px;
  padding-right: 5px;
}
.music_table td:nth-child(5), .music_table th:nth-child(5) {
  width: 125px;
  padding-left: 5px;
  padding-right: 5px;
}
.music_table td:nth-child(6), .music_table th:nth-child(6) {
  width: 250px;
  padding-left: 5px;
  padding-right: 5px;
}
.music_table td:nth-child(7), .music_table th:nth-child(7) {
  width: 60px;
  padding-left: 2px;
  padding-right: 2px;
}
.music_table td:nth-child(8), .music_table th:nth-child(8) {
  width: 60px;
  padding-left: 2px;
  padding-right: 2px;
}
audio {
  width: 240px;
  height: 36px;
  margin: auto 0;
}
</style>
