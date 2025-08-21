import { colors, paperThemeColors } from '@/constants/tokens'
import { Surface } from 'react-native-paper'
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { FloatingPlayerText } from '@/components/FloatingPlayer/FloatingPlayerText'
import { Image } from 'expo-image'
import { useEffect, useState } from 'react'
import { AudioPlayer, AudioStatus } from 'expo-audio'
import { syncLyricsProvider } from '@/utils/syncLyricsProvider'
import { FontAwesome6 } from '@expo/vector-icons'
import useImageColors from '@/hooks/useImageColors'
import { AndroidImageColors } from 'react-native-image-colors/build/types'
import useCoverColors from '@/hooks/useCoverColors'
import { useTranslation } from 'react-i18next'
import { ColorsDisplay, SortedColorsDisplay } from '@/components/FloatingUtils/ColorDisplay'

type FloatingPlayerProps = {
    songInfo?: MinimalMusicInfo
    playerStatus?: AudioStatus
    player?: AudioPlayer
    onFloatingPlayerPress?: () => void
}

const FloatingPlayer = ({
    songInfo,
    playerStatus,
    player,
    onFloatingPlayerPress,
}: FloatingPlayerProps) => {
    if (!songInfo) return null

    const { t } = useTranslation()

    const coverColorsSource = useImageColors(songInfo.cover) as AndroidImageColors | null
    const { coverColorsByLuminance, titleTextColor, lyricsTextColor } =
        useCoverColors(coverColorsSource)

    // Deconstructing all color props of the Android platform
    const { dominant, average, vibrant, darkVibrant, lightVibrant, darkMuted, lightMuted, muted } =
        coverColorsSource || {}

    // Lyrics display
    const [currentLyric, setCurrentLyric] = useState('')
    useEffect(() => {
        if (playerStatus?.duration !== undefined && playerStatus?.currentTime !== undefined) {
            setCurrentLyric(
                syncLyricsProvider(songInfo.lyrics, playerStatus.currentTime) ||
                    t('floatingPlayer.emptyLyrics'),
            )
        }
    }, [playerStatus?.currentTime, songInfo.lyrics])

    // Play/Pause
    const handlePlayPauseButton = () => {
        if (playerStatus?.playing === true) {
            player?.pause()
        } else {
            if (
                playerStatus &&
                playerStatus.currentTime !== undefined &&
                playerStatus.duration !== undefined &&
                playerStatus.isLoaded &&
                playerStatus.currentTime >= playerStatus.duration
            ) {
                player?.seekTo(0)
                player?.play()
            } else {
                player?.play()
            }
        }
    }

    // to player screen
    const handleOnPress = () => {
        onFloatingPlayerPress && onFloatingPlayerPress()
    }

    return (
        <TouchableOpacity activeOpacity={0.9} onPressOut={handleOnPress}>
            <View
                style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 70,
                    left: 0,
                    width: '100%',
                }}
            >
                {/*<ColorsDisplay coverColors={coverColorsSource} />*/}
                {/*<SortedColorsDisplay colors={coverColorsByLuminance} />*/}

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 75,
                        width: '100%',
                    }}
                >
                    <Surface
                        style={styles.surface}
                        elevation={4}
                        mode={'elevated'}
                        theme={{
                            colors: {
                                elevation: {
                                    level4: dominant ? dominant : paperThemeColors.elevation.level4,
                                },
                            },
                        }}
                    >
                        {songInfo.cover ? (
                            <Image
                                source={{ uri: songInfo.cover }}
                                style={{ ...styles.songCoverImage }}
                            />
                        ) : (
                            <MaterialIcons
                                name="art-track"
                                size={60}
                                style={{
                                    color: colors.textMutedOpacity90Light,
                                    backgroundColor: colors.textMutedOpacity30Light,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    ...styles.songCoverImage,
                                }}
                            />
                        )}
                        <FloatingPlayerText
                            songInfoText={songInfo}
                            currentLyric={currentLyric}
                            titleTextColor={titleTextColor}
                            lyricsTextColor={lyricsTextColor}
                        />
                        <TouchableOpacity
                            style={styles.playPauseButton}
                            onPress={handlePlayPauseButton}
                        >
                            <FontAwesome6
                                style={{
                                    color: titleTextColor ? titleTextColor : colors.text,
                                    ...styles.playPauseButtonIcon,
                                }}
                                name={playerStatus?.playing ? 'pause' : 'play'}
                                size={30}
                            />
                        </TouchableOpacity>
                    </Surface>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default FloatingPlayer

const styles = StyleSheet.create({
    surface: {
        width: '93%',
        height: '100%',
        flexDirection: 'row',
        borderRadius: 20,
    },
    songCoverImage: {
        borderRadius: 8,
        width: 75,
        height: 75,
        left: 0,
        bottom: 0,
        elevation: 10,
    },
    playPauseButton: {
        verticalAlign: 'middle',
        textAlignVertical: 'center',
        height: '100%',
        width: 50,
    },
    playPauseButtonIcon: {
        verticalAlign: 'middle',
        textAlignVertical: 'center',
        textAlign: 'center',
        height: '100%',
    },
})
