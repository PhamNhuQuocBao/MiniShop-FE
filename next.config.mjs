/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!process.env.REGION_HOSTS) return [];
    let hosts;
    try { hosts = JSON.parse(process.env.REGION_HOSTS); }
    catch { throw new Error('REGION_HOSTS must be a JSON object'); }
    if (!hosts || typeof hosts !== 'object' || Array.isArray(hosts)) throw new Error('REGION_HOSTS must be a JSON object');
    const routes = [
      ['/', '/'],
      ['/products/:id', '/products/:id'],
      ['/cart', '/cart'],
      ['/checkout', '/checkout'],
    ];
    const beforeFiles = Object.entries(hosts).flatMap(([host, region]) => {
      if (!['us', 'eu', 'vn'].includes(region)) throw new Error(`Invalid region for ${host}`);
      const value = host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return routes.map(([source, suffix]) => ({ source, destination: `/${region}${suffix === '/' ? '' : suffix}`, has: [{ type: 'host', value }] }));
    });
    return { beforeFiles, afterFiles: [], fallback: [] };
  },
};
export default nextConfig;
