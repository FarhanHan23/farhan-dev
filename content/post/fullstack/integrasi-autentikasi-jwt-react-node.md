---
title: "Arsitektur Autentikasi JWT Aman di React & Node.js"
description: "Mekanisme Access Token dan Refresh Token menggunakan HTTP-Only Cookie untuk mencegah serangan XSS."
publishedAt: 2026-10-25
tags: ["Fullstack", "React", "Security", "JWT"]
draft: false
---

Menyimpan token JWT di `localStorage` sangat rentan terhadap serangan **Cross-Site Scripting (XSS)**. Pendekatan standar industri adalah menyimpan Refresh Token di dalam **HTTP-Only Cookie**, sementara Access Token disimpan di memory aplikasi.

## 1. Setup Axios Interceptor untuk Auto Refresh

Di sisi frontend React, buat interceptor untuk menangkap error `401 Unauthorized`:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.farhan.dev/v1',
  withCredentials: true, // Mengirim HTTP-Only Cookie
});

let accessToken = '';

export const setAccessToken = (token: string) => {
  accessToken = token;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Request refresh token baru
      const { data } = await axios.post('/auth/refresh', {}, { withCredentials: true });
      setAccessToken(data.accessToken);
      originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

## 2. Pengiriman HTTP-Only Cookie dari Backend

Di backend Node.js / Express:

```typescript
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
});
```

Dengan pola ini, token rahasia tidak pernah bisa diakses oleh skrip berbahaya di browser pengguna.
