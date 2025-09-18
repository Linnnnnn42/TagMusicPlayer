import { Stack } from 'expo-router'
import { PaperProvider, MD3LightTheme as DefaultTheme, ActivityIndicator } from 'react-native-paper'
import { colors, paperThemeColors } from '@/constants/tokens'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import useGetMusicPlayer from '@/hooks/useGetMusicPlayer'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocales, Locale } from 'expo-localization'
import { initI18n } from '@/i18n/i18nNext'
import BootSplash from 'react-native-bootsplash'
import { View } from 'react-native'
import { AnimatedBootSplash } from '@/components/AnimatedBootSplash'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useTagManagement } from '@/hooks/useTagManagement'

// Setup global context
export const mediaLibraryContext = createContext<ReturnType<typeof useGetMediaLibrary> | null>(null)
export const musicPlayerContext = createContext<ReturnType<typeof useGetMusicPlayer> | null>(null)
export const tagContext = createContext<ReturnType<typeof useTagManagement> | null>(null)

export default function AppLayout() {
    // Setup global context
    const mediaLibrary = useGetMediaLibrary()
    const { loading: mediaLibraryLoading } = mediaLibrary
    const musicPlayer = useGetMusicPlayer(mediaLibrary)
    const tagManagement = useTagManagement(mediaLibraryLoading)
    const { loading: tagManagementLoading } = tagManagement

    // Initialization
    const locales = useRef<Locale[]>([])
    const languageCode = useRef<string>('')
    const [i18nLoading, setI18nLoading] = useState(true)
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
                setI18nLoading(false)
            })
    }, [])

    // Check if all resources are loaded
    useEffect(() => {
        if (!mediaLibraryLoading && !i18nLoading && !tagManagementLoading) {
            console.log('All resources loaded, ready to hide splash screen')
            setAppReady(true)
        }
    }, [mediaLibraryLoading, i18nLoading, tagManagementLoading])

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
            <musicPlayerContext.Provider value={musicPlayer}>
                <mediaLibraryContext.Provider value={mediaLibrary}>
                    <tagContext.Provider value={tagManagement}>
                        <PaperProvider theme={myTheme}>
                            <SafeAreaProvider>
                                <GestureHandlerRootView>
                                    <RootNavigation />
                                </GestureHandlerRootView>
                            </SafeAreaProvider>
                        </PaperProvider>
                    </tagContext.Provider>
                </mediaLibraryContext.Provider>
            </musicPlayerContext.Provider>
        )
    }

    // Otherwise show the splash screen animation
    return (
        <View style={{ flex: 1 }}>
            <AnimatedBootSplash
                shouldHide={appReady}
                onAnimationEnd={() => {
                    setSplashHidden(true)
                    BootSplash.hide({ fade: true }).then(() => {})
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
