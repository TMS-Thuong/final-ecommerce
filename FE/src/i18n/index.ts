import { createI18n } from 'vue-i18n'
import enMessages from './en'

const messages = {
  en: enMessages.en
}

const i18n = createI18n({
  legacy: false,
  locale: 'en', 
  fallbackLocale: 'en',
  messages,
})

export default i18n 