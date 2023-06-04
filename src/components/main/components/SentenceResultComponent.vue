<template>
  <v-card class="sentence_input_card" elevation="3">
    <v-card-title class="sentence_input_card_title">
      오늘은 기분이 {{ title[store['category']] }} 하루군요!
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle[store['category']] }}
    </v-card-subtitle>
    <v-card-text>
      <div class="music_player">
        <h3 class="mb-2">제목: {{store['music']['title']}}</h3>
        <h3 class="mb-3">작곡/작사: {{store['music']['author']}} / 아티스트: {{store['music']['artist']}}</h3>
        <audio-player
            :show-prev-button="false"
            :show-next-button="false"
            :audio-list="[api.SERVER_URL + store['music']['fileURL']]"
            theme-color="#7289DA"
        />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn class="reset_btn" variant="outlined" @click="reset">
        다시하기
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import {useClassifyStore} from "@/stores/classify/classifyStore";
import {defineEmits} from "vue";
import AudioPlayer from '@liripeng/vue-audio-player';
import api from '@/components/common/utils/httpUtil';

const store = useClassifyStore();
const emit = defineEmits(['reset']);

const title = {
  'POSITIVE': '좋은',
  'NEUTRAL': '그저 그런',
  'NEGATIVE': '우울한'
}

const subtitle = {
  'POSITIVE': '흥이 절로 나는 신나는 음악을 들려드려요..!',
  'NEUTRAL': '언제 들어도 듣기 좋은 무난한 음악을 들려드려요..!',
  'NEGATIVE': '기분을 달랠 수 있는 잔잔한 음악을 들려드려요..!'
}


async function reset() {
  emit('reset')
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sentence_input_card {
  width: calc(100% - 50px);
  max-width: 800px;
  margin: 25px auto;
}
.sentence_input_card_title {
  font-weight: bold;
}
.reset_btn {
  width: 200px;
  margin: 0 auto;
}
.music_player {
  max-width: 650px;
  margin: 20px auto;
}
</style>
