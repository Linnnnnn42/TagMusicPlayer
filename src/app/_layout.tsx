import { Stack } from 'expo-router'
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper'
import { paperThemeColors } from '@/constants/tokens'
import { createContext, useEffect, useState } from 'react'
import useGetMusicPlayer from '@/hooks/useGetMusicPlayer'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import BootSplash from 'react-native-bootsplash'
import { View } from 'react-native'
import { AnimatedBootSplash } from '@/components/AnimatedBootSplash'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useTagManagement } from '@/hooks/useTagManagement'
import useInitializeI18n from '@/hooks/useInitializeI18n'
import { useTagFilter } from '@/hooks/playingTab/useTagFilter'

// Setup global context
export const mediaLibraryContext = createContext<ReturnType<typeof useGetMediaLibrary> | null>(null)
export const musicPlayerContext = createContext<ReturnType<typeof useGetMusicPlayer> | null>(null)
export const tagContext = createContext<ReturnType<typeof useTagManagement> | null>(null)
export const tagFilterContext = createContext<ReturnType<typeof useTagFilter> | null>(null)

export default function AppLayout() {
    // Setup global context
    const mediaLibrary = useGetMediaLibrary()
    const { loading: mediaLibraryLoading } = mediaLibrary
    const musicPlayer = useGetMusicPlayer(mediaLibrary)
    const tagManagement = useTagManagement(mediaLibraryLoading)
    const { loading: tagManagementLoading } = tagManagement
    const { minimalMusicInfoList } = { ...mediaLibrary }
    const tagFilter = useTagFilter({
        minimalMusicInfoList,
        tagManagementLoading,
    })
    const { loading: tagFilterLoading } = tagManagement

    // Init util states
    const [appReady, setAppReady] = useState(false)
    const [splashHidden, setSplashHidden] = useState(false)

    // Initialize i18n
    const { i18nLoading } = useInitializeI18n()

    // Check if all resources are loaded
    useEffect(() => {
        if (!mediaLibraryLoading && !i18nLoading && !tagManagementLoading && !tagFilterLoading) {
            console.log('All resources loaded, ready to hide splash screen')
            setAppReady(true)
        }
    }, [mediaLibraryLoading, i18nLoading, tagManagementLoading, tagFilterLoading])

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
                        <tagFilterContext.Provider value={tagFilter}>
                            <PaperProvider theme={myTheme}>
                                <SafeAreaProvider>
                                    <GestureHandlerRootView>
                                        <RootNavigation />
                                    </GestureHandlerRootView>
                                </SafeAreaProvider>
                            </PaperProvider>
                        </tagFilterContext.Provider>
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
