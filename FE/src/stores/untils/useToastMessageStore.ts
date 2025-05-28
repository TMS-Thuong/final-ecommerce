import { ToastEnum } from '@/enums/toast'
import { defineStore } from 'pinia'

interface State {
  isShowToast: boolean
  toastType: ToastEnum
  toastMessage: string
}

export const useToastMessageStore = defineStore('toastMessage', {
  state: (): State => {
    return {
      isShowToast: false,
      toastType: ToastEnum.Success,
      toastMessage: 'Information',
    }
  },
  actions: {
    success(message: string) {
      this.toastType = ToastEnum.Success;
      this.toastMessage = message;
      this.isShowToast = true;
    },
    error(message: string) {
      this.toastType = ToastEnum.Error;
      this.toastMessage = message;
      this.isShowToast = true;
    },
    warning(message: string) {
      this.toastType = ToastEnum.Warning;
      this.toastMessage = message;
      this.isShowToast = true;
    },
    info(message: string) {
      this.toastType = ToastEnum.Info;
      this.toastMessage = message;
      this.isShowToast = true;
    }
  }
})
