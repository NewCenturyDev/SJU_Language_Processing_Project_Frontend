<template>
  <v-app-bar
      :color="'#FFFFFF'"
      :elevation="2">
    <v-app-bar-nav-icon
        v-if="isVisible"
        @click="$emit('navbarTriggerBtn')">
      <v-icon icon="mdi-menu"></v-icon>
    </v-app-bar-nav-icon>
    <v-app-bar-title
        class="title"
        :text="'NLP AI Music Player'">
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <slot name="buttons"></slot>
  </v-app-bar>
</template>

<script setup>
import {defineEmits, ref, watch} from "vue";

defineEmits(['navbarTriggerBtn']);
let isVisible = ref(location.hash !== '#/');

watch(() => location.hash, () => {
  isVisible.value = location.hash !== '#/';
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  color: #000000;
  font-weight: bold;
}
</style>
