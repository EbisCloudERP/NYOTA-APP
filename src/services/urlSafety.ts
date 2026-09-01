import { Linking } from "react-native";

/**
 * Hosts (and their subdomains) that the app is allowed to open in an
 * external browser. `www.` is stripped before matching.
 *
 * Extend this list when new legitimate meeting/video/portal hosts are used.
 */
const ALLOWED_HOSTS = [
  // Webinar / meeting platforms
  "meet.google.com",
  "zoom.us",
  "zoom.com",
  "teams.microsoft.com",
  "teams.live.com",
  "webex.com",
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "mux.com",
  "stream.mux.com",
  // Messaging / contact
  "wa.me",
  "whatsapp.com",
  // Portals used by the app
  "egpkenya.go.ke",
  // First-party / backend domains
  "ebisclouderp.com",
  "nyota.com",
];

const ALLOWED_SCHEMES = ["https:", "tel:", "mailto:", "sms:"];

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/** Returns true if a URL is safe to hand to `Linking.openURL`. */
export function isSafeExternalUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl) return false;

  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return false;
  }

  if (!ALLOWED_SCHEMES.includes(url.protocol)) {
    return false;
  }

  // tel:, mailto: and sms: links have no hostname. Require a non-empty target.
  if (url.protocol !== "https:") {
    return rawUrl.trim().length > url.protocol.length + 1;
  }

  const host = normalizeHost(url.hostname);
  return ALLOWED_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`),
  );
}

/**
 * Opens an external URL only if it passes the allowlist.
 * Returns true when the URL was opened, false when it was blocked or failed.
 */
export async function openExternalUrl(
  rawUrl: string | null | undefined,
): Promise<boolean> {
  if (!isSafeExternalUrl(rawUrl)) {
    return false;
  }
  try {
    await Linking.openURL(rawUrl as string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Schemes accepted for inbound deep links. The app's own scheme is `nyota`.
 * `https` is allowed so universal/web links keep working; `http` only in dev.
 */
const ALLOWED_DEEP_LINK_SCHEMES = __DEV__
  ? ["nyota:", "https:", "http:"]
  : ["nyota:", "https:"];

/** Returns true if an inbound deep link uses an allowed scheme. */
export function isSafeDeepLink(rawUrl: string | null | undefined): boolean {
  if (!rawUrl) return false;

  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return false;
  }

  return ALLOWED_DEEP_LINK_SCHEMES.includes(url.protocol);
}
