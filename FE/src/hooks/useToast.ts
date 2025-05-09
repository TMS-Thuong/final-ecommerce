import { ref } from 'vue'
import { ToastEnum } from '@/enums/toast'
import { useToastMessageStore } from '@/stores/useToastMessageStore'

export const useToast = () => {
  const toastMessageStore = useToastMessageStore()
  const toastType = ref<ToastEnum | null>(null)
  const toastMessage = ref<string>('')

  const showToast = (type: ToastEnum, message: string) => {
    toastType.value = type
    toastMessage.value = message
    toastMessageStore.toastType = type
    toastMessageStore.toastMessage = message
    toastMessageStore.isShowToast = true
    setTimeout(() => {
      toastMessageStore.isShowToast = false
    }, 3000)
  }
  
  return {
    showToast,
    toastType,
    toastMessage,
    toastMessageStore
  }
}
