/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Lab fixture: allow a large Server Action multipart body so the
    // CVE-2026-64641 O(n^2) validation path can be exercised. Production keeps
    // the framework default (1 MB).
    serverActions: {
      bodySizeLimit: process.env.LOCAL_CVE_MODE === '1' ? '10mb' : '1mb',
    },
  },
  async rewrites() {
    // Local supplier asset routing for CVE-2026-64645 condition study.
    const supplierAssets = process.env.LOCAL_CVE_MODE === '1' ? [{
      source: '/supplier-assets/:path*',
      // Study fixture for CVE-2026-64645: hostname comes from a request query.
      // The capture group and destination param must be lowercase because Next
      // parses the destination hostname as a URL (hostnames are lowercased).
      has: [{ type: 'query', key: 'host', value: '(?<supplierhost>.+)' }],
      destination: 'https://:supplierhost/:path*',
    }] : [];
    if (!process.env.REGION_HOSTS) return supplierAssets;
    let hosts;
    try { hosts = JSON.parse(process.env.REGION_HOSTS); }
    catch { throw new Error('REGION_HOSTS must be a JSON object'); }
    if (!hosts || typeof hosts !== 'object' || Array.isArray(hosts)) throw new Error('REGION_HOSTS must be a JSON object');
    const routes = [
      ['/', '/'],
      ['/products/:id', '/products/:id'],
      ['/products', '/products'],
      ['/cart', '/cart'],
      ['/checkout', '/checkout'],
    ];
    const beforeFiles = Object.entries(hosts).flatMap(([host, region]) => {
      if (!['us', 'eu', 'vn'].includes(region)) throw new Error(`Invalid region for ${host}`);
      const value = host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return routes.map(([source, suffix]) => ({ source, destination: `/${region}${suffix === '/' ? '' : suffix}`, has: [{ type: 'host', value }] }));
    });
    return { beforeFiles: [...supplierAssets, ...beforeFiles], afterFiles: [], fallback: [] };
  },
};
export default nextConfig;
