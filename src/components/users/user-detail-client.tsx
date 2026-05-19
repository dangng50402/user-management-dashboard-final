"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { usePosts } from "@/hooks/use-user-posts"
import { useAlbums } from "@/hooks/use-user-albums"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Post, Album } from "@/types/user"
import Link from "next/link"

interface UserDetailClientProps {
  userId: number
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  )
}

export function UserDetailClient({ userId }: UserDetailClientProps) {
  const router = useRouter()
  const { data: user, isPending: isUserPending, isError: isUserError } = useUser(userId)
  const { data: posts, isPending: isPostsPending, isError: isPostsError } = usePosts(userId)
  const { data: albums, isPending: isAlbumsPending, isError: isAlbumsError } = useAlbums(userId)

  if (isUserPending) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isUserError || !user) {
    return (
      <div className="p-6">
        <ErrorState message="Không thể tải thông tin user." />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Back button */}
      <Button variant="outline" onClick={() => router.push("/users")}>
        ← Quay lại
      </Button>

      {/* User info */}
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium">Username:</span> {user.username}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Phone:</span> {user.phone}</p>
          <p>
            <span className="font-medium">Website:</span>{" "}
            <Link href={`https://${user.website}`} target="_blank" className="text-blue-500 underline">
              {user.website}
            </Link>
          </p>
          <p><span className="font-medium">Công ty:</span> {user.company.name}</p>
          <p>
            <span className="font-medium">Địa chỉ:</span>{" "}
            {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-4">
          {isPostsPending && <ListSkeleton />}
          {isPostsError && <ErrorState message="Không thể tải posts." />}
          {!isPostsPending && !isPostsError && posts?.map((post: Post) => (
            <Card key={post.id}>
              <CardContent className="space-y-2 p-4">
                <h3 className="font-semibold capitalize">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.body}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="albums" className="space-y-4 mt-4">
          {isAlbumsPending && <ListSkeleton />}
          {isAlbumsError && <ErrorState message="Không thể tải albums." />}
          {!isAlbumsPending && !isAlbumsError && albums?.map((album: Album) => (
            <Card key={album.id}>
              <CardContent className="p-4">
                <h3 className="font-medium capitalize">{album.title}</h3>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}