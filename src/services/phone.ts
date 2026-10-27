const KENYAN_COUNTRY_CODE = "254";

/**
 * Normalises a Kenyan phone number to the MSISDN form the API expects
 * (e.g. `0712 345 678` / `+254712345678` / `712345678` -> `254712345678`).
 *
 * Safe to call on an already-normalised number.
 */
export function toKenyanMsisdn(value: string): string {
  const national = value.replace(/\D/g, "").replace(/^0+/, "");

  if (national.startsWith(KENYAN_COUNTRY_CODE)) {
    return national;
  }

  return `${KENYAN_COUNTRY_CODE}${national}`;
}
