<template>
  <nav-bar-component>
    <template v-slot:buttons>
      <v-btn @click="gotoAdminConsole" v-if="isAdmin">관리자</v-btn>
      <v-btn @click="doLogout" v-if="store['loggedIn']">로그아웃</v-btn>
      <v-btn @click="openLoginModal" v-else>로그인</v-btn>
    </template>
  </nav-bar-component>
</template>

<script setup>
import NavBarComponent from "@/components/common/components/NavBarComponent";
import {useCredentialStore} from "@/stores/credential/credentialStore";
import {defineEmits, onBeforeMount, ref, watch} from "vue";
import storeUtil from '@/stores/utils';
import router from "@/plugins/route";

const store = useCredentialStore();
const emit = defineEmits(['login']);
const isAdmin = ref(null);

onBeforeMount(checkIsAdmin);

watch(() => store['profile'], () => {
  checkIsAdmin();
});

function openLoginModal() {
  emit('login');
}

function gotoAdminConsole() {
  router.push('/console');
}

function doLogout() {
  storeUtil.resetForLogout();
}

function checkIsAdmin() {
  if (store['profile']) {
    isAdmin.value = store['profile']['permissions'][0].includes('ADMIN');
  } else {
    isAdmin.value = false;
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
