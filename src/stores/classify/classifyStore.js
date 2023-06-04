import {defineStore} from 'pinia';
import {ref} from "vue";

export const useClassifyStore = defineStore('classify', () => {
    /* State */
    const music = ref(null);
    const timestamp = ref(null);
    const category = ref(null);
    const text = ref(null);
    const mode = ref('stand_by');

    return {music, timestamp, category, text, mode};
}, {
    persist: {
        paths: ['music', 'timestamp', 'category', 'text'],
    },
});
