import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "nyota_auth_token";
const USER_KEY = "nyota_auth_user";
const UUID_KEY = "nyota_onboarding_uuid";

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setUser(user: object): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function setUuid(uuid: string): Promise<void> {
  await SecureStore.setItemAsync(UUID_KEY, uuid);
}

export async function getUuid(): Promise<string | null> {
  return SecureStore.getItemAsync(UUID_KEY);
}

export async function getUser(): Promise<object | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
    SecureStore.deleteItemAsync(UUID_KEY),
  ]);
}
