export type Region = 'us' | 'eu' | 'vn';

export function isRegion(value: string): value is Region {
  return value === 'us' || value === 'eu' || value === 'vn';
}

export function regionPrefix(pathname: string) {
  const first = pathname.split('/')[1];
  return isRegion(first) ? `/${first}` : '';
}
