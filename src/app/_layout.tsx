import { Stack } from 'expo-router'
import { PaperProvider, MD3LightTheme as DefaultTheme, ActivityIndicator } from 'react-native-paper'
import { colors, paperThemeColors } from '@/constants/tokens'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import useMusicPlayer from '@/hooks/useMusicPlayer'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocales, Locale } from 'expo-localization'
import { initI18n } from '@/i18n/i18nNext'
import BootSplash from 'react-native-bootsplash'
import { View } from 'react-native'
import { AnimatedBootSplash } from '@/components/AnimatedBootSplash'

// Setup splashscreen animation

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

    // Initialization
    const { loading } = mediaLibrary
    const locales = useRef<Locale[]>([])
    const languageCode = useRef<string>('')
    const [isI18nLoaded, setIsI18nLoaded] = useState(false)
    const [appReady, setAppReady] = useState(false)
    const [splashHidden, setSplashHidden] = useState(false)

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
            .then((r) => console.log('i18 Loaded'))
            .finally(async () => {
                setIsI18nLoaded(true)
            })
    }, [])

    // Check if all resources are loaded
    useEffect(() => {
        if (!loading && isI18nLoaded) {
            console.log('All resources loaded, ready to hide splash screen')
            setAppReady(true)
        }
    }, [loading, isI18nLoaded])

    const myTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            ...paperThemeColors,
        },
    }

    // Render the main app when the app is ready and the splash screen is hidden
    if (appReady && splashHidden) {
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

    // Otherwise show the splash screen animation
    return (
        <View style={{ flex: 1 }}>
            <AnimatedBootSplash
                shouldHide={appReady}
                onAnimationEnd={() => {
                    setSplashHidden(true)
                    BootSplash.hide({ fade: true })
                }}
            />
        </View>
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
