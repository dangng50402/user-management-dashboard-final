# User Management Dashboard

Ứng dụng quản lý người dùng xây dựng với Next.js App Router, TanStack Query v5, Zustand và Shadcn/UI.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, Shadcn/UI
- **Data Fetching**: TanStack Query v5
- **State Management**: Zustand
- **Form**: React Hook Form + Zod
- **API**: JSONPlaceholder (fake REST API)

## Tính năng

- **Danh sách users** — hiển thị dạng table, search/filter/sort sync URL
- **Search** — tìm theo tên, email, username, công ty (debounce 400ms)
- **Filter** — lọc theo thành phố
- **Sort** — sắp xếp theo tên, email, công ty
- **User detail** — xem đầy đủ thông tin, tabs Posts và Albums
- **Create** — tạo user với form validation, optimistic update
- **Edit** — chỉnh sửa user, chỉ submit khi có thay đổi (isDirty)
- **Delete** — xóa user với confirm dialog, optimistic update + rollback
- **Responsive** — mobile 375px và desktop 1280px

## Cài đặt

```bash
# Clone repo
git clone https://github.com/dangng50402/user-management-dashboard-final

# Di chuyển vào thư mục
cd user-management-dashboard-final

# Cài dependencies
pnpm install

# Chạy dev server
pnpm dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

## Cấu trúc thư mục

src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── layout.tsx      # Sidebar + Header layout
│   │   └── users/          # Users pages
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Redirect → /users
├── components/
│   ├── layout/             # Header, Sidebar
│   ├── ui/                 # Shadcn components
│   └── users/              # Feature components
├── hooks/                  # Custom hooks
├── lib/                    # API, schemas, utils
├── providers/              # QueryProvider
├── stores/                 # Zustand stores
└── types/                  # TypeScript types

## Scripts

```bash
pnpm dev          # Dev server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm test         # Vitest
```