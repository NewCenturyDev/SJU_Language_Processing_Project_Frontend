import {defineStore} from 'pinia';
import {ref} from "vue";

export const useClassifyStore = defineStore('classify', () => {
    /* State */
    const music = ref(null);
    const timestamp = ref(null);
    const category = ref(null);
    const text = ref(null);

    return {music, timestamp, category, text};
}, {
    persist: {
        paths: ['music', 'timestamp', 'category', 'text'],
    },
});
