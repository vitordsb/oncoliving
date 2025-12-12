export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const useDevLogin =
    import.meta.env.VITE_DEV_LOCAL_AUTH === "true" ||
    !import.meta.env.VITE_OAUTH_PORTAL_URL;

  if (useDevLogin) {
    return "/api/auth/dev-login";
  }

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    console.warn(
      "[Auth] Missing VITE_OAUTH_PORTAL_URL or VITE_APP_ID; using home as fallback"
    );
    return "/";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const normalizedBase = oauthPortalUrl.replace(/\/+$/, "");
  const url = new URL(`${normalizedBase}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
