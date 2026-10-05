# TixFlow Frontend

Frontend của nền tảng đặt vé sự kiện TixFlow, sử dụng Next.js 16 và React 19.

## Yêu cầu

- Node.js 22.x (được khóa bằng trường `engines` trong `package.json`).
- Backend TixFlow và Keycloak đã chạy từ repository `../tixflow-backend`.
- Không tạo lại Git repository: thư mục này đã là repository độc lập.

## Cấu hình local

Tạo file cấu hình bị Git bỏ qua:

```powershell
Copy-Item .env.example .env.local
```

| Biến | Giá trị local mặc định | Mục đích |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Địa chỉ API mà trình duyệt gọi. |
| `NEXT_PUBLIC_OIDC_AUTHORITY` | `http://localhost:8180/realms/tixflow` | Issuer công khai của Keycloak. |
| `NEXT_PUBLIC_OIDC_CLIENT_ID` | `tixflow-web` | Client OIDC dành cho frontend. |
| `NEXT_PUBLIC_OIDC_REDIRECT_URI` | `http://localhost:3000/auth/callback` | Callback sau đăng nhập; phải khớp Keycloak. |
| `NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI` | `http://localhost:3000/` | Địa chỉ quay lại sau đăng xuất; phải khớp Keycloak. |

Các biến `NEXT_PUBLIC_*` được Next.js nhúng vào bundle khi build. Thay đổi chúng cho production yêu cầu build lại image/frontend; không đặt secret vào các biến này.

## Chạy local

```powershell
npm ci
npm run dev
```

Truy cập `http://localhost:3000`.

## Smoke check

Sau khi backend chạy, xác minh lần lượt:

```text
http://localhost:3000/
http://localhost:8080/health
http://localhost:8080/swagger/v1/swagger.json
http://localhost:8180/realms/tixflow/.well-known/openid-configuration
```

Đăng nhập thử tại trang `/account`. Access, ID và refresh token chỉ được giữ trong bộ nhớ trình duyệt; khi refresh token không còn hợp lệ, giao diện yêu cầu đăng nhập lại thay vì lưu token lâu dài.

## Production và Docker

`output: "standalone"` tạo server production tối giản. Chạy local sau khi build bằng:

```powershell
npm run build
npm run start
```

Dockerfile cũng dùng server standalone này. Truyền toàn bộ `NEXT_PUBLIC_*` bằng build argument khi build image, ví dụ:

```powershell
docker build `
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com `
  --build-arg NEXT_PUBLIC_OIDC_AUTHORITY=https://id.example.com/realms/tixflow `
  --build-arg NEXT_PUBLIC_OIDC_CLIENT_ID=tixflow-web `
  --build-arg NEXT_PUBLIC_OIDC_REDIRECT_URI=https://web.example.com/auth/callback `
  --build-arg NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI=https://web.example.com/ `
  -t tixflow-web .
docker run --rm -p 3000:3000 tixflow-web
```

Đừng dùng `next start` cho output standalone.
