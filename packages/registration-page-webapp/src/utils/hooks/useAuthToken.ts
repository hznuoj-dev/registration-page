const authTokenKey = 'registration-page-auth-token';

export function useAuthToken() {
  const getToken = function (): string {
    let token = window.localStorage[authTokenKey];
    if (!token) token = '';
    return token;
  };

  const signIn = function (token: string) {
    window.localStorage[authTokenKey] = token;
  };

  const signOut = function () {
    window.localStorage[authTokenKey] = '';
  };

  return {
    getToken,
    signIn,
    signOut,
  };
}
