import { api, Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import type { Device, Variant } from '@/lib/experiment';

const heroCopy = {
  A: { eyebrow: 'GÓC LÀM VIỆC CỦA BẠN', title: 'Phụ kiện nhỏ.', accent: 'Trải nghiệm lớn.', description: 'Chọn những món đồ gọn gàng, hữu ích cho ngày làm việc tốt hơn.', art: '✳' },
  B: { eyebrow: 'MINISHOP SELECTION', title: 'Nâng cấp góc làm việc.', accent: 'Bắt đầu từ hôm nay.', description: 'Những phụ kiện đáng dùng, được chọn cho nhịp làm việc của bạn.', art: '⌁' },
  C: { eyebrow: 'CÔNG NGHỆ CHO MỖI NGÀY', title: 'Gọn hơn. Linh hoạt hơn.', accent: 'Làm việc theo cách bạn thích.', description: 'Tìm món đồ vừa vặn với bàn làm việc và thói quen của bạn.', art: '◈' },
} as const;

export async function StorefrontHome({ q, prefix = '', variant, device, page = 'home' }: { q: string; prefix?: string; variant: Variant; device: Device; page?: 'home' | 'plp' }) {
  let products: Product[] = [];
  let error = '';
  try { products = (await api<{ products: Product[] }>(`/api/products?q=${encodeURIComponent(q)}`)).products; }
  catch (e) { error = e instanceof Error ? e.message : 'Không tải được sản phẩm'; }
  const hero = heroCopy[variant];
  const isPlp = page === 'plp';
  // Cookie-based HTML varies by visitor, so these pages use request rendering instead of a shared full-route cache.
  return <div className="wrap">
    <section className={`hero hero--variant-${variant.toLowerCase()}${isPlp ? ' hero--plp' : ''}`}>
      <div className="heroCopy"><span className="eyebrow">{hero.eyebrow}</span><h1>{hero.title}<br/><em>{hero.accent}</em></h1><p>{hero.description}</p><a className="button" href="#products">{isPlp ? 'Xem danh mục' : 'Khám phá sản phẩm'}</a></div>
      <div className="heroArt" aria-hidden="true">{hero.art}</div>
    </section>
    <section id="products" className="section"><div className="sectionHead"><div><span className="eyebrow">{isPlp ? 'DANH MỤC SẢN PHẨM' : 'BỘ SƯU TẬP'}</span><h2>{isPlp ? 'Tất cả sản phẩm' : 'Sản phẩm nổi bật'}</h2></div><form method="get"><input name="q" defaultValue={q} placeholder="Tìm theo tên sản phẩm..." aria-label="Tìm sản phẩm"/><button>Tìm kiếm</button></form></div>
      {error ? <div className="notice error">{error}</div> : products.length ? <div className={`grid experimentGrid experimentGrid--${variant.toLowerCase()}${isPlp ? ` plpGrid plpGrid--${device}` : ''}`}>{products.map(p => <ProductCard key={p.id} product={p} prefix={prefix}/>)}</div> : <div className="notice">Không có sản phẩm phù hợp.</div>}
    </section>
  </div>;
}
