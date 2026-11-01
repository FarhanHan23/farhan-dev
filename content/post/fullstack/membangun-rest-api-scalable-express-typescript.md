---
title: "Membangun REST API Scalable dengan Express & TypeScript"
description: "Arsitektur berlapis (Controller, Service, Repository) untuk backend Node.js yang rapi dan mudah di-maintain."
publishedAt: 2026-10-31
tags: ["Fullstack", "TypeScript", "Node.js", "Express"]
draft: false
---

Dalam membangun aplikasi Fullstack skala besar, struktur backend memegang peranan krusial. Pola **Layered Architecture** memisahkan logic HTTP, business logic, dan akses database agar kode tidak menumpuk di file controller.

## 1. Struktur Interface & DTO

Gunakan TypeScript untuk mendefinisikan tipe request dan response secara ketat:

```typescript
export interface CreateUserDTO {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

## 2. Implementasi Service Layer

Service bertanggung jawab atas validasi dan aturan bisnis:

```typescript
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async createUser(dto: CreateUserDTO): Promise<UserResponse> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new Error("Email sudah terdaftar.");
    }
    return this.userRepo.create(dto);
  }
}
```

## 3. Controller Handler

Controller hanya bertugas menangani request HTTP dan mengirim status code yang sesuai:

```typescript
import { Request, Response } from 'express';

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
```

Dengan pemisahan ini, setiap layer dapat diuji (*unit testing*) secara independen dengan mudah.
