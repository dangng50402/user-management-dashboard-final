import { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { SortField, SortOrder } from "@/types/user"

const VALID_SORT  = ["name", "email", "company"] as const
const VALID_ORDER = ["asc", "desc"] as const

const DEFAULTS = {
  city:  "all",
  sort:  "name" as SortField,
  order: "asc"  as SortOrder,
  page:  1,
} as const

function parseEnum<T extends string>(
  value: string | null,
  valid: readonly T[],
  fallback: T
): T {
  if (!value) return fallback
  return (valid as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : fallback
}

export function useTableQueryState() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  // Đọc và parse từ URL
  const query = searchParams.get("q") ?? ""
  const city  = searchParams.get("city") ?? DEFAULTS.city  // city filter
  const sort  = parseEnum(searchParams.get("sort"),  VALID_SORT,  DEFAULTS.sort)
  const order = parseEnum(searchParams.get("order"), VALID_ORDER, DEFAULTS.order)
  const page  = parsePositiveInt(searchParams.get("page"), DEFAULTS.page)

  const buildParams = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(overrides)) {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      return params
    },
    [searchParams]
  )

  const navigate = useCallback(
    (params: URLSearchParams) => {
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname]
  )

  const navigateIfChanged = useCallback(
    (newParams: URLSearchParams) => {
      if (newParams.toString() !== searchParams.toString()) {
        navigate(newParams)
      }
    },
    [navigate, searchParams]
  )

  const setQuery = useCallback((value: string) => {
    navigateIfChanged(buildParams({
      q:    value || null,
      page: "1",
    }))
  }, [buildParams, navigateIfChanged])

  const setCity = useCallback((value: string) => {
    navigateIfChanged(buildParams({
      city: value === DEFAULTS.city ? null : value,
      page: "1",
    }))
  }, [buildParams, navigateIfChanged])

  const setSort = useCallback((field: SortField, newOrder: SortOrder) => {
    navigateIfChanged(buildParams({
      sort:  field    === DEFAULTS.sort  ? null : field,
      order: newOrder === DEFAULTS.order ? null : newOrder,
      page:  "1",
    }))
  }, [buildParams, navigateIfChanged])

  const setPage = useCallback((newPage: number) => {
    navigateIfChanged(buildParams({
      page: newPage === 1 ? null : String(newPage),
    }))
  }, [buildParams, navigateIfChanged])

  return { query, city, sort, order, page, setQuery, setCity, setSort, setPage }
}