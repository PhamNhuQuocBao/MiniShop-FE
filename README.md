# MiniShop Frontend

Next.js 15.1.0 / React 19.0.0. Đây là repo frontend độc lập; API nằm tại [MiniShop-BE](https://github.com/PhamNhuQuocBao/MiniShop-BE).

## Chạy local

Node.js 22.18.0. Tạo `.env.local` từ `.env.example` và chỉnh `API_BASE_URL` tới backend đang chạy (mặc định `http://localhost:4000`).

```bash
npm ci
npm run dev
# http://localhost:3000
```

Build production: `npm run build && npm start`. Health: `/api/health`. Browser gọi Server Actions/Server Components cùng origin FE; API URL chỉ dùng phía server, không cần `NEXT_PUBLIC_API_BASE_URL`.

## Render

Tạo **Web Service** từ repo này, root directory để trống (repo root), build `npm ci && npm run build`, start `npm start`, health `/api/health`, Node `22.18.0`. Đặt `API_BASE_URL=https://<backend-cua-ban>.onrender.com` tại Render trước khi build. Có thể dùng `render.yaml` của repo. Chờ backend và MongoDB sẵn sàng, sau đó deploy FE. Thay `API_BASE_URL` cần redeploy FE.

**Lưu ý bảo mật:** Next.js 15.1.0 được pin theo yêu cầu dự án và npm cảnh báo phiên bản này có lỗ hổng. Không đưa bản này lên public khi chưa đánh giá rủi ro và có lớp bảo vệ phù hợp. Không có dữ liệu/secret thật trong repo.
