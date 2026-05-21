"use client";

import { useState, memo, useCallback } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  Globe,
  Phone,
  Users,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/types/user";
import { EmptyState } from "../ui/empty-state";
import { ConfirmDialog } from "../ui/confirm-dialog";


interface UserTableProps {
  users: User[];
  isPending: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  search: string;
  showActions?: boolean;
}

// ─── HighlightText ────────────────────────────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(
    `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ─── UserRow ──────────────────────────────────────────────────────────────────
interface UserRowProps {
  user: User;
  search: string;
  showActions?: boolean;
  isDeleting: boolean;
  onEdit: (user: User) => void;
  onRequestDelete: (id: number) => void;
}

const UserRow = memo(function UserRow({
  user,
  search,
  showActions,
  isDeleting,
  onEdit,
  onRequestDelete,
}: UserRowProps) {

  const isOptimistic = user.id < 0;

  const handleEdit = useCallback(() => onEdit(user), [onEdit, user]);

  const handleRequestDelete = useCallback(
    () => onRequestDelete(user.id),
    [onRequestDelete, user.id]
  );

  return (
    <TableRow className={isOptimistic ? "opacity-50" : "hover:bg-muted/50"}>
      {/* Cột 1: Link bọc avatar + name + email → navigate /users/[id] */}
      <TableCell>
        <Link
          href={isOptimistic ? "#" : `/users/${user.id}`}
          className="flex items-center gap-3"
          tabIndex={isOptimistic ? -1 : 0}
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">
              <HighlightText text={user.name} query={search} />
            </p>
            <p className="text-muted-foreground text-xs">
              <HighlightText text={user.email} query={search} />
            </p>
          </div>
        </Link>
      </TableCell>

      {/* Cột 2: Phone + Website */}
      <TableCell className="hidden md:table-cell">
        <div className="space-y-1">
          {user.phone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {user.phone}
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              {user.website}
            </div>
          )}
        </div>
      </TableCell>

      {/* Cột 3: Company + City */}
      <TableCell className="hidden lg:table-cell">
        <div>
          <p className="text-sm">
            <HighlightText text={user.company.name} query={search} />
          </p>
          <p className="text-xs text-muted-foreground">{user.address.city}</p>
        </div>
      </TableCell>

      {/* Cột 4: Actions */}
      {showActions && (
        <TableCell className="text-right">
          {isOptimistic ? (
            <Badge variant="secondary" className="text-xs">
              Đang xử lý...
            </Badge>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/users/${user.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleRequestDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      )}
    </TableRow>
  );
});

// ─── UserTable ────────────────────────────────────────────────────────────────
export function UserTable({
  users,
  isPending,
  onEdit,
  onDelete,
  isDeleting,
  search,
  showActions,
}: UserTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // const handleEdit = useCallback((user: User) => onEdit(user), [onEdit]);
  const handleRequestDelete = useCallback(
    (id: number) => setDeleteTargetId(id),
    []
  );
  const handleConfirmDelete = useCallback(() => {
    if (deleteTargetId !== null) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, onDelete]);

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-10 w-10" />}
        title="Không tìm thấy user nào"
        description={
          search
            ? `Không có kết quả nào cho "${search}". Thử từ khóa khác.`
            : "Thử thay đổi bộ lọc hoặc tạo user mới."
        }
      />
    );
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Liên hệ</TableHead>
              <TableHead className="hidden lg:table-cell">Công ty</TableHead>
              {showActions && (
                <TableHead className="text-right">Hành động</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                search={search}
                showActions={showActions ?? false}
                isDeleting={isDeleting}
                onEdit={onEdit}
                onRequestDelete={handleRequestDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Xác nhận xóa"
        description="Hành động này không thể hoàn tác. User sẽ bị xóa vĩnh viễn."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}