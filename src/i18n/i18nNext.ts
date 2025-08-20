import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEn from './locales/en/translation.json'
import translationZh from './locales/zh/translation.json'

const resources = {
    en: { translation: translationEn },
    zh: { translation: translationZh },
}

export const initI18n = async (languageCode: string, savedLanguageCode?: string) => {
    if (savedLanguageCode) {
        languageCode = savedLanguageCode
    }

    await i18n.use(initReactI18next).init({
        compatibilityJSON: 'v4',
        resources,
        lng: languageCode,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })
}

export default i18n
