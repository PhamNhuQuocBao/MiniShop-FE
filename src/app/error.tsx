'use client';
export default function Error({reset}:{reset:()=>void}){return <div className="wrap notice error">Có lỗi xảy ra. <button onClick={reset}>Thử lại</button></div>}
