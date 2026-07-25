import {useCallback, useState} from "react";

export interface ModalController {
  isOpen: boolean
  open: () => void
  close: () => void
}
export function useModal(initialValue: boolean): ModalController {
  const [isOpen, setOpen] = useState(initialValue);
  const open = useCallback(() => {
    setOpen(true)
  }, [])
  const close = useCallback(() => {
    setOpen(false)
  }, [])
  return {isOpen, open, close}
}
