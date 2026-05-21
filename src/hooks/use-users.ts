import { userApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { CityFilter, SortField, SortOrder, User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const PAGE_SIZE = 5;

interface UseUsersOptions {
  search: string;
  filter: CityFilter;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
}

export function useUsers({
  search,
  filter,
  sortField,
  sortOrder,
  page,
}: UseUsersOptions) {
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

  const cities = useMemo(
    () => [...new Set(allUsers.map((u) => u.address.city))].sort(),
    [allUsers],
  );

  const filteredUsers = useMemo(() => {
    let result: User[] = [...allUsers];

    // 1. Filter theo city
    if (filter !== "all") {
      result = result.filter((u) => u.address.city === filter);
    }

    // Search theo name, email, username, company
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.company.name.toLowerCase().includes(q),
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

  const totalFiltered = filteredUsers.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return {
    users: paginatedUsers,
    cities,
    totalCount: allUsers.length,
    filteredCount: filteredUsers.length,
    totalPages,
    isPending,
    isError,
    error,
    isFetching,
  };
}
