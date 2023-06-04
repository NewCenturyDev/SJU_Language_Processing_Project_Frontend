
import {useCredentialStore} from "@/stores/credential/credentialStore";
import {useClassifyStore} from "@/stores/classify/classifyStore";

export default  {
  resetForLogout() {
    useCredentialStore().$reset();
    useClassifyStore().$reset();
    localStorage.removeItem('credential');
  }
}
