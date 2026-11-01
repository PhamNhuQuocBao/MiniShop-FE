export const dynamic = 'force-dynamic';

// Only synthetic fixture data. Middleware protects this route in the lab.
export function GET() {
  return Response.json({ marker: 'ADMIN_DEMO_ONLY', summary: { products: 8, orders: 12 } });
}
