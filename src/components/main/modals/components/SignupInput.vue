<template>
  <v-form ref="form">
    <v-container>
      <v-row v-if="isNew">
        <v-col class="v-col" md="12">
          <v-text-field
              v-model="inputCommon.email"
              :rules="emailRules"
              :counter="50"
              label="이메일 주소"
              placeholder="반드시 유효한 이메일 주소를 입력해 주십시요"
              variant="outlined"
              density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="isNew">
        <v-col class="v-col" md="6">
          <v-text-field
              v-model="inputCommon.password"
              :rules="passwordRules"
              :counter="20"
              label="비밀번호"
              placeholder="8자리 이상~20자리 미만으로 입력하십시요"
              variant="outlined"
              density="compact"
              type="password"
          ></v-text-field>
        </v-col>
        <v-col class="v-col" md="6">
          <v-text-field
              v-model="passwordCheck"
              :rules="passwordRules"
              :counter="20"
              label="비밀번호 확인"
              placeholder="상기의 비밀번호를 동일하게 입력하여 주십시오"
              variant="outlined"
              density="compact"
              type="password"
              @keyup="validate"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="v-col" md="12">
          <v-text-field
              v-model="inputCommon.username"
              :rules="usernameRules"
              :counter="20"
              label="사용자 닉네임"
              placeholder="50자 이내로 입력해주십시요"
              variant="outlined"
              density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="v-col" md="6">
          <v-text-field
              v-model="inputCommon.name"
              :rules="nameRules"
              :counter="20"
              label="성함"
              placeholder="20자 이내로 입력해주십시요"
              variant="outlined"
              density="compact"
          ></v-text-field>
        </v-col>
        <v-col class="v-col" md="6">
          <v-text-field
              v-model="inputCommon.phone"
              :rules="phoneRules"
              :counter="20"
              label="전화번호"
              placeholder="전화번호를 입력하십시오"
              variant="outlined"
              density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import {reactive, ref, defineProps, defineExpose, watch} from "vue";


const props = defineProps({isNew: Boolean, defaultEntity: Object, setEntity: Function});
const form = ref(null);
const passwordCheck = ref('');
const inputCommon = reactive({
  email: '',
  password: '',
  username: '',
  phone: '',
  name: '',
});


watch(inputCommon, () => {
  props.setEntity(inputCommon);
});
defineExpose({validate});


if (props.defaultEntity) {
  const defaultValue = ref(props.defaultEntity);
  inputCommon['username'] = defaultValue.value['username'];
  inputCommon['name'] = defaultValue.value['name'];
  inputCommon['phone'] = defaultValue.value['phone'];
}

async function validate() {
  const result = await form.value.validate();
  return result.valid;
}

const emailRules = [
  value => {return value ? true : '이메일을 입력하십시오';},
  value => {return String(value)
      .toLowerCase()
      .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
      ) ? true : '이메일 양식이 잘못되었습니다';},
  value => {return String(value).length <= 50 ? true : '이메일은 50자를 초과할 수 없습니다';}
];
const passwordRules = [
  value => {return value ? true : '사용자 비밀번호를 입력하십시오';},
  value => {return value === passwordCheck.value ? true : '비밀번호 확인이 일치하지 않습니다';},
  value => {return 8 <= String(value).length && String(value).length <= 20 ? true : '사용자 비밀번호는 8~20자 이내여야 합니다';},
];
const usernameRules = [
  value => {return value ? true : '사용자 닉네임을 입력하십시오';},
  value => {return String(value).length <= 50 ? true : '사용자 닉네임은 50자를 초과할 수 없습니다';}
];
const nameRules = [
  value => {return value ? true : '성함을 입력하십시오';},
  value => {return String(value).length <= 20 ? true : '성함은 20자를 초과할 수 없습니다';}
];
const phoneRules = [
  value => {return value ? true : '전화번호를 입력하십시오';},
  value => {return String(value)
      .toLowerCase()
      .match(
          '((^02|^\\d{3})-\\d{3,4}-\\d{4}$|\\d{4}-\\d{4}$)'
      ) ? true : '전화번호 양식이 잘못되었습니다 (대표번호는 사용할 수 없습니다)';}
];
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-col {
  padding: 5px !important;
}
</style>
