import Script from 'next/script';
import { cookies } from 'next/headers';
import { CAMPAIGN_COOKIE } from '@/lib/campaign';

/**
 * Exposes the current storefront configuration to the pre-hydration bootstrap.
 * Tag managers read these values before React mounts, so they are rendered as
 * data attributes on an inline script.
 */
export async function StorefrontBootstrap() {
  const jar = await cookies();
  const campaign = jar.get(CAMPAIGN_COOKIE)?.value ?? '';
  const region = jar.get('region')?.value ?? 'us';

  return <Script
    id="storefront-bootstrap"
    strategy="beforeInteractive"
    data-campaign={campaign}
    data-region={region}
  >{`window.__storefrontReady = true;`}</Script>;
}
