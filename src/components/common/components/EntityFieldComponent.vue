<template>
  <v-card class="entity_field_card" variant="outlined">
    <v-card-title>
      <h5>{{props.fieldName}}</h5>
    </v-card-title>
    <v-card-text>{{props.fieldValue}}</v-card-text>
  </v-card>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({fieldName: String, fieldValue: null});
</script>

<style scoped>
.entity_field_card {
  height: 100%;
}
</style>
