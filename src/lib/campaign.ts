/**
 * Campaign attribution for the storefront.
 *
 * Marketing links carry `?utm_campaign=` (or the short `?ref=`). The value is
 * kept in a cookie so the attribution survives navigation, and it is forwarded
 * to the storefront bootstrap script so analytics can read it before hydration.
 */

export const CAMPAIGN_COOKIE = 'campaign';

/** Attribution values are short labels; anything longer is truncated. */
export const CAMPAIGN_MAX_LENGTH = 512;

export function normalizeCampaign(value: string | null | undefined): string {
  if (!value) return '';
  return value.trim().slice(0, CAMPAIGN_MAX_LENGTH);
}

/** Extract the campaign from a storefront URL, preferring the canonical param. */
export function campaignFromSearch(searchParams: URLSearchParams): string {
  return normalizeCampaign(searchParams.get('utm_campaign') ?? searchParams.get('ref'));
}
