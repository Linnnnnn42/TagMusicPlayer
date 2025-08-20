import { Stack } from 'expo-router'
import { PaperProvider, MD3LightTheme as DefaultTheme, ActivityIndicator } from 'react-native-paper'
import { colors, paperThemeColors } from '@/constants/tokens'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import useMusicPlayer from '@/hooks/useMusicPlayer'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocales, Locale } from 'expo-localization'
import { initI18n } from '@/i18n/i18nNext'

export interface GlobalMusicPlayerContextType {
    mediaLibrary: ReturnType<typeof useGetMediaLibrary>
    musicPlayer: ReturnType<typeof useMusicPlayer>
}

// Setup global context
export const globalMusicPlayerContext = createContext<GlobalMusicPlayerContextType | null>(null)

export default function AppLayout() {
    // Setup global context
    const mediaLibrary = useGetMediaLibrary()
    const musicPlayer = useMusicPlayer(mediaLibrary)

    // Setup i18n
    const locales = useRef<Locale[]>([])
    const languageCode = useRef<string>('')
    const [i18nReady, setI18nReady] = useState(false)
    useEffect(() => {
        const initializeI18n = async () => {
            try {
                locales.current = getLocales()
                languageCode.current = locales.current[0]?.languageCode || 'en'
                console.log(languageCode.current)

                await initI18n(languageCode.current)

                setI18nReady(true)
            } catch (error) {
                console.error('Error initializing i18n:', error)
            }
        }

        initializeI18n().then((r) => console.log('i18 Loaded'))
    }, [])
    if (!i18nReady) {
        return null
    }

    const myTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            ...paperThemeColors,
        },
    }

    return (
        <globalMusicPlayerContext.Provider value={{ mediaLibrary, musicPlayer }}>
            <PaperProvider theme={myTheme}>
                <SafeAreaProvider>
                    <RootNavigation />
                </SafeAreaProvider>
            </PaperProvider>
        </globalMusicPlayerContext.Provider>
    )
}

// Entry for App / Init App
const RootNavigation = () => {
    return (
        <Stack>
            {/*Tabs*/}
            <Stack.Screen name={'(tabs)'} options={{ headerShown: false }} />
        </Stack>
    )
}
