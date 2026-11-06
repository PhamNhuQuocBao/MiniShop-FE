'use client';
export default function Error({reset}:{reset:()=>void}){return <div className="wrap page"><div className="notice error" role="alert"><h1>Không tải được trang</h1><p>Đã có lỗi xảy ra. Vui lòng thử lại.</p><button onClick={reset}>Thử lại</button></div></div>}
