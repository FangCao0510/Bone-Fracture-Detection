import {useCallback, useState} from "react";

export function useRefresh() {
  const [refresh, setRefresh] = useState<boolean>(false)
  const toggleRefresh =  useCallback(() => {
    setRefresh(pre => !pre)
  }, [])
  return {
    refresh,
    toggleRefresh
  }
}
