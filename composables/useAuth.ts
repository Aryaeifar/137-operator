import type { TokenParams } from "../types/auth";

export default function () {
  const { $storage } = useNuxtApp();

  let params = $storage.get("auth");

  let shouldClearAuth: boolean = false;
  if (params) {
    let current_time = Date.now();
    let expires_time = Date.parse(params.expires_in);

    if (current_time > expires_time) {
      params = null;
      shouldClearAuth = true;
    }
  }

  const auth = useState<TokenParams | null>("auth", () => params || null);

  const clearAuth = () => {
    useUser().clearUserData();
    $storage.remove("auth");
    if (auth?.value) {
      auth.value = null;
    }
  };

  if (shouldClearAuth) {
    clearAuth();
  }

  const isLoggedIn = () => {
    return !!auth.value?.access_token;
  };

  const getToken = (): TokenParams | null => {
    return auth.value;
  };

  const setToken = (params: TokenParams) => {
    $storage.set("auth", params);
    auth.value = params;
  };

  const logOut = () => {
    clearAuth();
  };

  return {
    isLoggedIn,
    getToken,
    setToken,
    clearAuth,
    logOut,
  };
}
