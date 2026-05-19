import { useQuery } from "@tanstack/react-query"
import { userApi } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import type { Post } from "@/types/user"

export function usePosts(id: number) {
  return useQuery<Post[]>({
    queryKey: queryKeys.users.posts(id),
    queryFn: () => userApi.getPosts(id),
  })
}

