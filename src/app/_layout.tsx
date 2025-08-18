import { Stack } from 'expo-router'
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper'
import { colors, paperThemeColors } from '@/constants/tokens'
import { createContext, useContext } from 'react'
import useMusicPlayer from '@/hooks/useMusicPlayer'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
