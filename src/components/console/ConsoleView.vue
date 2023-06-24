<template>
  <v-layout>
    <header-fragment
        @logout="gotoMain"
    ></header-fragment>
    <v-main>
      <v-banner class="console_tabs">
        <v-tabs v-model="currentTab">
          <v-btn @click="gotoMain" class="home_btn" variant="text" prepend-icon="mdi-arrow-left">메인으로</v-btn>
          <v-tab value="user_input">이용기록 관리</v-tab>
          <v-tab value="music">음악파일 관리</v-tab>
          <v-tab value="train">학습데이터 관리</v-tab>
        </v-tabs>
      </v-banner>
      <v-window v-model="currentTab" class="tab_window">
        <v-window-item value="user_input">
          <user-input-manage-component></user-input-manage-component>
        </v-window-item>
        <v-window-item value="music">
          <music-manage-component></music-manage-component>
        </v-window-item>
        <v-window-item value="train">
          <train-manage-component></train-manage-component>
        </v-window-item>
      </v-window>
    </v-main>
  </v-layout>
</template>

<script setup>
import HeaderFragment from '@/components/common/components/HeaderFragment';
import {ref, watch} from 'vue';
import {useCredentialStore} from "@/stores/credential/credentialStore";
import router from "@/plugins/route";
import MusicManageComponent from "@/components/console/components/MusicManageComponent";
import TrainManageComponent from "@/components/console/components/TrainManageComponent";
import UserInputManageComponent from "@/components/console/components/UserInputManageComponent";


const store = useCredentialStore();
const currentTab = ref('user_input');

if (!store['loggedIn'] || !store['profile'] || (!store['profile']['permissions'].includes('ROOT_ADMIN') && !store['profile']['permissions'].includes('ADMIN'))) {
  alert('잘못된 접근입니다! (로그인 안됨 또는 권한 없음)');
  gotoMain();
}

watch(() => store['loggedIn'], value => {
  if (!value) {
    alert('잘못된 접근입니다! (로그인 안됨 또는 권한 없음)');
    gotoMain();
  }
});

function gotoMain() {
  router.replace("/");
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.console_tabs {
  padding-top: 0;
  padding-bottom: 0;
  padding-inline-start: 0;
  -webkit-padding-start: 0;
  padding-inline-end: 0;
  -webkit-padding-end: 0;
}
.home_btn {
  height: 48px !important;
}
.tab_window {
  padding: 0 25px;
}
</style>
