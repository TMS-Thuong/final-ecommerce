declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module '@heroicons/vue/solid' {
  import { DefineComponent } from 'vue'

  export const EyeIcon: DefineComponent
  export const EyeOffIcon: DefineComponent
  export const LockClosedIcon: DefineComponent
  export const LockOpenIcon: DefineComponent
}

declare global {
  interface Window {
    initGoogleSignIn: () => void
  }
}



