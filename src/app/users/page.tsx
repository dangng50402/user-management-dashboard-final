import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersPageClient } from "@/components/users/users-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
  description: "Danh sách và quản lý người dùng",
};

function UsersPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Toolbar skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
      </div>
      {/* Table skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Người dùng</h1>
        <p className="text-muted-foreground text-sm">
          Quản lý danh sách người dùng
        </p>
      </div>

      <Suspense fallback={<UsersPageSkeleton />}>
        <UsersPageClient />
      </Suspense>
    </div>
  );
}