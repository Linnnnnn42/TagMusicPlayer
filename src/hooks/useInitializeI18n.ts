import { useState, useRef, useEffect } from 'react'
import { getLocales, Locale } from 'expo-localization'
import { initI18n } from '@/i18n/i18nNext'

export const useInitializeI18n = () => {
    const locales = useRef<Locale[]>([])
    const languageCode = useRef<string>('')
    const [i18nLoading, setI18nLoading] = useState(true)

    useEffect(() => {
        const initializeI18n = async () => {
            try {
                locales.current = getLocales()
                languageCode.current = locales.current[0]?.languageCode || 'en'
                console.log('LanguageCode:', languageCode.current)

                await initI18n(languageCode.current)
            } catch (error) {
                console.error('Error initializing i18n:', error)
            }
        }

        initializeI18n()
            .then(() => console.log('i18 Loaded'))
            .finally(async () => {
                setI18nLoading(false)
            })
    }, [])

    return {
        i18nLoading,
        languageCode: languageCode.current,
    }
}

export default useInitializeI18n
