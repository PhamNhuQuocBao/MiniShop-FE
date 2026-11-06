import './globals.css';
import {CartProvider} from '@/components/CartProvider';
import {Header} from '@/components/Header';
import {MarketingScripts} from '@/components/MarketingScripts';
export const metadata={title:'MiniShop | Phụ kiện công nghệ',description:'Phụ kiện công nghệ cho góc làm việc của bạn'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><MarketingScripts/><CartProvider><Header/><main>{children}</main><footer className="footer"><div className="wrap">MiniShop · Cửa hàng phụ kiện mẫu · Không có thanh toán thật</div></footer></CartProvider></body></html>}
