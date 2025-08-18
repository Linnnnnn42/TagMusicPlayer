import { colors } from '@/constants/tokens'
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
import * as React from 'react'

type FloatingPlayerProps = {
    songInfo?: MinimalMusicInfo
    playerStatus?: AudioStatus
    player?: AudioPlayer
}

const FloatingPlayer = ({ songInfo, playerStatus, player }: FloatingPlayerProps) => {
    if (!songInfo) return null

    const [currentLyric, setCurrentLyric] = useState('')
    useEffect(() => {
        if (playerStatus?.duration !== undefined && playerStatus?.currentTime !== undefined) {
            setCurrentLyric(syncLyricsProvider(songInfo.lyrics, playerStatus.currentTime))
        }
    }, [playerStatus?.currentTime, songInfo.lyrics])

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
                console.log('hi1')
                player?.seekTo(0)
                player?.play()
            } else {
                console.log('hi12')
                player?.play()
            }
        }
    }

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 70,
                left: 0,
                height: 75,
                width: '100%',
            }}
        >
            <Surface style={styles.surface} elevation={4} mode={'elevated'}>
                {songInfo.cover ? (
                    <Image source={{ uri: songInfo.cover }} style={{ ...styles.songCoverImage }} />
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
                <FloatingPlayerText songInfoText={songInfo} currentLyric={currentLyric} />
                <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPauseButton}>
                    <FontAwesome6
                        style={styles.playPauseButtonIcon}
                        name={playerStatus?.playing ? 'pause' : 'play'}
                        size={30}
                    />
                </TouchableOpacity>
            </Surface>
        </View>
    )
}

export default FloatingPlayer

const styles = StyleSheet.create({
    surface: {
        width: '95%',
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
        width: 80,
    },
    playPauseButtonIcon: {
        verticalAlign: 'middle',
        textAlignVertical: 'center',
        textAlign: 'center',
        height: '100%',
    },
})
