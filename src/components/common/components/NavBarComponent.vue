<template>
  <v-app-bar
      :color="'#FFFFFF'"
      :elevation="2">
    <v-app-bar-title
        class="title"
        :text="'NLP AI Music Player'">
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <slot name="buttons"></slot>
  </v-app-bar>
</template>

<script setup>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  color: #000000;
  font-weight: bold;
}
</style>
