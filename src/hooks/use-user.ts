import { useQuery } from "@tanstack/react-query"
import { userApi } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import type { User } from "@/types/user"

export function useUser(id: number) {
  return useQuery<User>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userApi.getById(id),
  })
}