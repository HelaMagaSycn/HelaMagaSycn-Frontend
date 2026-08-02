import { UserManager, WebStorageStateStore, type UserManagerSettings } from "oidc-client-ts";

let manager: UserManager | undefined;

export function getUserManager() {
  if (typeof window === "undefined") return undefined;
  if (manager) return manager;

  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8180";
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "helamaga";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  const settings: UserManagerSettings = {
    authority: `${keycloakUrl}/realms/${realm}`,
    client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "helamaga-web",
    redirect_uri: `${appUrl}/auth/callback`,
    post_logout_redirect_uri: appUrl,
    response_type: "code",
    scope: "openid profile email",
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  };

  manager = new UserManager(settings);
  return manager;
}

export function getRealmRoles(profile: Record<string, unknown>) {
  const realmAccess = profile.realm_access as { roles?: string[] } | undefined;
  return realmAccess?.roles ?? [];
}
