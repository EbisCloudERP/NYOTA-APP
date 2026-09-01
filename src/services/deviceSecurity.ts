import JailMonkey from "jail-monkey";
import { Platform } from "react-native";

/**
 * Returns true when the device appears to be rooted/jailbroken or otherwise
 * compromised.
 *
 * - Skipped in dev builds: emulators are commonly rooted and would produce
 *   constant false alarms during development.
 * - Fails open: if the native module isn't linked (e.g. Expo Go), we treat the
 *   device as safe rather than crashing the app.
 */
export function isDeviceCompromised(): boolean {
  if (__DEV__) {
    return false;
  }

  try {
    if (JailMonkey.isJailBroken()) {
      return true;
    }

    if (Platform.OS === "android" && JailMonkey.hookDetected()) {
      return true;
    }

    return JailMonkey.trustFall();
  } catch {
    return false;
  }
}
