import { UserDetailClient } from "@/components/users/user-detail-client"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `User #${id}` }
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params
  const userId = Number(id)

  if (isNaN(userId)) {
    return <div>Invalid user ID</div>
  }

  return <UserDetailClient userId={userId} />
}