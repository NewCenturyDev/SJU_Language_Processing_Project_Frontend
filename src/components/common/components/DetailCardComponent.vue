<template>
  <v-card v-if="isLoaded" class="detail_card">
    <v-card-title>
      <v-container class="wrapper">
        <v-row class="detail_card_title">
          <v-btn @click="gotoList" variant="text" icon="mdi-arrow-left"></v-btn>
          <div v-if="entity['name']">{{ props.title }} - {{entity['name']}}</div>
          <div v-else>{{ props.title }}</div>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text class="detail_card_body">
      <v-container class="wrapper">
        <slot name="contents"></slot>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <slot name="buttons"></slot>
    </v-card-actions>
  </v-card>
  <v-card v-else class="detail_card">
    <v-card-title>
      {{ props.title }} - 로딩 중입니다...
    </v-card-title>
    <v-card-text>
      <v-container class="wrapper">
        <v-row class="wait_msg">
          <v-progress-circular indeterminate></v-progress-circular>
          <h5>잠시만 기다려 주십시오...</h5>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {defineProps, onBeforeMount, ref, watch} from 'vue';
import router from './route';

const props = defineProps({isLoaded: Boolean, title: String, entity: Object, entityLoader: Function, listPath: String});
let isLoaded = ref(props.isLoaded);

onBeforeMount(() => {
  if (props.entityLoader) {
    props.entity ? isLoaded.value = true : props.entityLoader();
  }
});

function gotoList() {
  router.replace(props.listPath);
}

watch(() => props.isLoaded, () => {
  isLoaded.value = props.isLoaded;
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.detail_card {
  margin: 25px;
}
.detail_card_title {
  align-items: center;
}
.detail_card_title > div {
  margin-left: 20px;
}
.detail_card_body {
  overflow-x: scroll;
}
.wait_msg {
  align-items: center;
}
.wait_msg > h5 {
  margin-left: 20px;
}
.wrapper {
  max-width: 100%;
}
</style>
