import { Tabs } from 'expo-router'
import { colors, fontSize, fontWeight, tabIcons } from '@/constants/tokens'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, StyleSheet, type ViewProps } from 'react-native'
import FloatingPlayer from '@/components/FloatingPlayer/FloatingPlayer'
import useGlobalMusicPlayer from '@/hooks/useGlobalMusicPlayer'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Player, { type PlayerHandle } from '@/app/player'

// Component for ripple effect on Android with customizable ripple color
const TabBarButton = ({
    rippleColor = colors.primaryOpacity30,
    ...props
}: ViewProps & { rippleColor?: string }) => (
    <Pressable
        {...props}
        android_ripple={{
            color: rippleColor,
            borderless: true,
        }}
    />
)

// tabBar config
const tabScreens = [
    {
        name: '(playlists)',
        title: 'tabs.playing',
        icon: {
            name: tabIcons.playlists as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 29,
        },
    },
    {
        name: 'tags',
        title: 'tabs.tags',
        icon: {
            name: tabIcons.tags as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 28,
        },
    },
    {
        name: 'favorites',
        title: 'tabs.favorites',
        icon: {
            name: tabIcons.favorites as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 26,
        },
    },
    {
        name: 'songs',
        title: 'tabs.songs',
        icon: {
            name: tabIcons.songs as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 28,
        },
    },
] as const

export default function TabsLayout() {
    // Get translation
    const { t } = useTranslation()

    // Get global context
    const { musicPlayer } = useGlobalMusicPlayer()
    const { songInfoPlaying, playerStatus, player, playerModeSetter } = musicPlayer
    
    // Player ref
    const playerRef = useRef<PlayerHandle>(null)

    useEffect(() => {
        playerModeSetter({ shouldPlayInBackground: true }).then(() => {
            console.log('Audio mode set to play in background')
        })
    }, []) // execute once when onMount

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarLabelStyle: {
                        fontSize: fontSize.xxs,
                        fontWeight: fontWeight.bold,
                    },
                    tabBarStyle: {
                        paddingHorizontal: 10,
                        height: 60,
                    },
                    headerShown: false,
                }}
            >
                {tabScreens.map((screen) => (
                    <Tabs.Screen
                        key={screen.name}
                        name={screen.name}
                        options={{
                            title: t(screen.title),
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons
                                    name={screen.icon.name}
                                    size={screen.icon.size}
                                    color={color}
                                />
                            ),
                            tabBarButton: TabBarButton,
                        }}
                    />
                ))}
            </Tabs>
            <FloatingPlayer
                songInfo={songInfoPlaying}
                playerStatus={playerStatus}
                player={player}
                onFloatingPlayerPress={() => playerRef.current?.openPlayer()}
            />
            <Player ref={playerRef} />
        </>
    )
}
