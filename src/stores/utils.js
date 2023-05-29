
import {useCredentialStore} from "@/stores/credential/credentialStore";

export default  {
  resetForLogout() {
    useCredentialStore().$reset();
    localStorage.removeItem('credential');
  }
}
