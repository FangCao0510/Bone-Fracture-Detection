import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback} from "react";

export function useSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const addSearchParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams]
  )
  return {
    searchParams,
    addSearchParam
  }
}
