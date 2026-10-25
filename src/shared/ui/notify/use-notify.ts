import { useToast } from 'primevue/usetoast'

export function useNotify() {
  const toast = useToast()

  function success(summary: string, detail?: string): void {
    toast.add({ severity: 'success', summary, detail, life: 3000 })
  }

  function error(summary: string, detail?: string): void {
    toast.add({ severity: 'error', summary, detail, life: 5000 })
  }

  return { success, error }
}
