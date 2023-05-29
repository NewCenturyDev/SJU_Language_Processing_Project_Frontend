<template>
  <nav-bar-component>
    <template v-slot:buttons>
      <v-btn v-if="!store['loggedIn']">로그인</v-btn>
      <v-btn v-if="store['profile']['permissions'].includes('ADMIN')">관리자</v-btn>
      <v-btn v-if="store['loggedIn']">로그아웃</v-btn>
    </template>
  </nav-bar-component>
</template>

<script setup>
import NavBarComponent from "@/components/common/components/NavBarComponent";
import {useCredentialStore} from "@/stores/credential/credentialStore";

const store = useCredentialStore();


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
