"use client";

import { useState, useCallback } from "react";
import { useTableQueryState } from "@/hooks/use-table-query-state";
import { useUsers } from "@/hooks/use-users";
import { useCreateUser } from "@/hooks/use-create-user";
import { useUpdateUser } from "@/hooks/use-update-user";
import { useDeleteUser } from "@/hooks/use-delete-user";
import { UserToolbar } from "@/components/users/user-toolbar";
import { UserTable } from "@/components/users/user-table";
import dynamic from "next/dynamic";
import type { UserFormValues } from "@/lib/schemas";
import type { User, SortField, SortOrder } from "@/types/user";

const UserDialog = dynamic(
  () => import("@/components/users/user-dialog").then((m) => m.UserDialog),
  { ssr: false }
);

export function UsersPageClient() {
  const { query, status, sort, order, setQuery, setStatus, setSort } =
    useTableQueryState();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { users, totalCount, filteredCount, isPending, isError, error } =
    useUsers({
      search: query,   // query từ URL — UserToolbar đã debounce trước khi setQuery
      filter: status,
      sortField: sort,
      sortOrder: order,
    });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const handleCreateClick = useCallback(() => {
    setEditingUser(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: number) => deleteMutation.mutate(id),
    [deleteMutation.mutate]
  );

  const handleDialogSubmit = useCallback(
    (values: UserFormValues) => {
      if (editingUser) {
        updateMutation.mutate(
          {
            id: editingUser.id,
            data: {
              name: values.name,
              username: values.username,
              email: values.email,
              phone: values.phone,
              website: values.website,
              address: { ...editingUser.address, city: values.address.city },
              company: editingUser.company, // form không có field company
            },
          },
          { onSuccess: () => setDialogOpen(false) }
        );
      } else {
        createMutation.mutate(
          {
            name: values.name,
            username: values.username,
            email: values.email,
            phone: values.phone,
            website: values.website,
            address: { city: values.address.city },
          },
          { onSuccess: () => setDialogOpen(false) }
        );
      }
    },
    [editingUser, updateMutation, createMutation]
  );

  const handleSortFieldChange = useCallback(
    (f: SortField) => setSort(f, order),
    [setSort, order]
  );

  const handleSortOrderChange = useCallback(
    (o: SortOrder) => setSort(sort, o),
    [setSort, sort]
  );

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Không thể tải dữ liệu: {(error as Error).message}
        </div>
      )}

      <UserToolbar
        search={query}
        onSearchChange={setQuery}
        filter={status}
        onFilterChange={setStatus}
        sortField={sort}
        onSortFieldChange={handleSortFieldChange}
        sortOrder={order}
        onSortOrderChange={handleSortOrderChange}
        onCreateClick={handleCreateClick}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      <UserTable
        users={users}
        isPending={isPending}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
        search={query}
        showActions
      />

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingUser={editingUser}
        onSubmit={handleDialogSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}