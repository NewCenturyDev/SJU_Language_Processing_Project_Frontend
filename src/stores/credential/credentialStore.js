import {defineStore} from 'pinia';
import {ref} from "vue";

export const useCredentialStore = defineStore('credential', () => {
    /* State */
    const profile = ref(null);
    const token = ref(null);
    const loggedIn = ref(false);

    return {profile, token, loggedIn};
}, {
    persist: {
        paths: ['profile', 'token', 'loggedIn'],
    },
});
