import * as React from "react"

export function useToast() {
  const [toasts, setToasts] = React.useState([])

  const toast = React.useCallback((toast) => {
    setToasts((current) => [...current, toast])
    setTimeout(() => {
      setToasts((current) => current.slice(1))
    }, 3000) // auto-remove after 3s
  }, [])

  return {
    toast,
    toasts,
  }
}
