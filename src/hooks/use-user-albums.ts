import { useQuery } from "@tanstack/react-query"
import { userApi } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import type { Album } from "@/types/user"

export function useAlbums(id: number) {
  return useQuery<Album[]>({
    queryKey: queryKeys.users.albums(id),
    queryFn: () => userApi.getAlbums(id),
  })
}