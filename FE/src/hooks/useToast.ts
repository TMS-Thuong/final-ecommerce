import { ref, watch } from 'vue'
import { ToastEnum } from '@/enums/toast'
import { useToastMessageStore } from '@/stores/useToastMessageStore'

export const useToast = () => {
  const toastMessageStore = useToastMessageStore()
  const toastType = ref<ToastEnum>(toastMessageStore.toastType)
  const toastMessage = ref<string>(toastMessageStore.toastMessage)

  watch(() => toastMessageStore.toastType, (newType) => {
    toastType.value = newType
  })

  watch(() => toastMessageStore.toastMessage, (newMessage) => {
    toastMessage.value = newMessage
  })

  const showToast = (type: ToastEnum, message: string) => {
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
