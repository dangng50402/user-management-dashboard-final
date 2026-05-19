import { userApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { FilterStatus, SortField, SortOrder, User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseUsersOptions {
  search: string;
  filter: FilterStatus;
  sortField: SortField;
  sortOrder: SortOrder;
}

export function useUsers({ search, filter, sortField, sortOrder }: UseUsersOptions) {
  const {
    data: allUsers = [],
    isPending,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: userApi.getAll,
  });

  const filteredUsers = useMemo(() => {
    let result: User[] = [...allUsers];

    // Filter theo FilterStatus
    if (filter === "has-website") {
      result = result.filter((u) => Boolean(u.website));
    } else if (filter === "no-website") {
      result = result.filter((u) => !u.website);
    }

    // Search theo name, email, username, company
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.company.name.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const valA =
        sortField === "company"
          ? a.company.name.toLowerCase()
          : a[sortField].toLowerCase();
      const valB =
        sortField === "company"
          ? b.company.name.toLowerCase()
          : b[sortField].toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allUsers, search, filter, sortField, sortOrder]);

  return {
    users: filteredUsers,
    totalCount: allUsers.length,
    filteredCount: filteredUsers.length,
    isPending,
    isError,
    error,
    isFetching,
  };
}