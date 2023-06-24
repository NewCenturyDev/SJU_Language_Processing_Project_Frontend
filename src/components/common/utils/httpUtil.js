import router from '@/plugins/route';
import storeUtil from "@/stores/utils";

export default {
    SERVER_URL: 'http://sju-nlp-api.newcentury99.com',
    handleHttpError: function (error, onAuthErr, onApiErr) {
        if (error.name === 'AxiosError' && error.response.data['_metadata']
            && error.response.status === 401
        ) {
            onAuthErr ? onAuthErr() : this.defaultOnAuthErr();
        } else if (error.name === 'AxiosError' && error.response.data['_metadata']) {
            console.warn(error.response.data['_metadata']['message']);
            if (onApiErr) {
                onApiErr(error.response.data['_metadata']['message']);
            } else {
                alert(error.response.data['_metadata']['message']);
            }
        } else {
            console.log(error);
        }
    },
    defaultOnAuthErr: async function () {
        storeUtil.resetForLogout();
        await router.push('/');
    }
}
