import {defineStore} from 'pinia';
import {ref} from "vue";

export const useCredentialStore = defineStore('credential', () => {
    /* State */
    const profile = ref({
        id: null,
        email: null,
        language: null,
        username: null,
        country: null,
        birth: null,
        gender: null,
        phone: null,
        permissions: [],
        verified: null,
        active: null,
        credentialsNonExpired: null
    });
    const token = ref(null);
    const loggedIn = ref(false);

    return {profile, token, loggedIn};
}, {
    persist: {
        paths: ['profile', 'token', 'loggedIn'],
    },
});
