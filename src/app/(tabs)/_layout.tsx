import { Tabs } from 'expo-router'
import { colors, fontSize, fontWeight, tabIcons } from '@/constants/tokens'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, StyleSheet, type ViewProps } from 'react-native'
import FloatingPlayer from '@/components/FloatingPlayer/FloatingPlayer'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BottomPlayer, { type BottomPlayerHandle } from '@/components/BottomPlayer/BottomPlayer'
import { musicPlayerContext } from '@/app/_layout'
import useCoverColors from '@/hooks/player/useCoverColors'
import { MinimalMusicInfo } from '@/database/types'
import { AudioPlayer, AudioStatus } from 'expo-audio'
import { i18nTokens } from '@/i18n/i18nTokens'
import { useSyncLyrics } from '@/hooks/player/useSyncLyrics'

export type PlayerProps = {
    songInfo?: MinimalMusicInfo
    playerStatus?: AudioStatus
    player?: AudioPlayer
    currentLyric?: string
    backgroundColor?: string
    lyricsTextColor?: string
    titleTextColor?: string
}

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
        name: '(songs)',
        title: 'tabs.songs',
        icon: {
            name: tabIcons.songs as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 28,
        },
    },
    {
        name: 'playing',
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
] as const

export default function TabsLayout() {
    // Get translation
    const { t } = useTranslation()

    // Get global context
    const musicPlayer = useContext(musicPlayerContext)
    if (!musicPlayer) {
        throw new Error('useContext Fail')
    }
    const {
        songInfoPlaying,
        playerStatus,
        player,
        playerModeSetter,
        handleSongChange,
        nextSongId,
        previousSongId,
    } = musicPlayer
    // Get colors
    const {
        coverColorsSource,
        coverColorsByLuminance,
        titleTextColor,
        lyricsTextColor,
        backgroundColor,
    } = useCoverColors()

    // Get lyrics
    const [currentLyric, setCurrentLyric] = useState('')
    useSyncLyrics(songInfoPlaying.lyrics, playerStatus?.currentTime, (lyric) => {
        setCurrentLyric(lyric || t(i18nTokens.player.emptyLyrics))
    })

    // BottomPlayer ref
    const playerRef = useRef<BottomPlayerHandle>(null)

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
                currentLyric={currentLyric}
                backgroundColor={backgroundColor}
                lyricsTextColor={lyricsTextColor}
                titleTextColor={titleTextColor}
                coverColorsSource={coverColorsSource}
                coverColorsByLuminance={coverColorsByLuminance}
            />
            <BottomPlayer
                ref={playerRef}
                backgroundColor={backgroundColor}
                lyricsTextColor={lyricsTextColor}
                titleTextColor={titleTextColor}
                songInfo={songInfoPlaying}
                playerStatus={playerStatus}
                player={player}
                currentLyric={currentLyric}
                nextSongId={nextSongId || ''}
                previousSongId={previousSongId || ''}
                handleSongChange={handleSongChange}
            />
        </>
    )
}
