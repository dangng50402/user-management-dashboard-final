import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "User Management Dashboard",
  description: "Quản lý người dùng",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={geist.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}