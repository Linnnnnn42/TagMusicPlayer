import { colors } from '@/constants/tokens'
import { ProgressBar, Searchbar, Surface } from 'react-native-paper'
import { View, Text, StyleSheet, Animated } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { PlayerControls } from '@/components/FloatingPlayer/FloatingPlayerControls'
import { FloatingPlayerText } from '@/components/FloatingPlayer/FloatingPlayerText'
import { Image } from 'expo-image'
import { useEffect } from 'react'

type FloatingPlayerProps = {
    songInfo?: MinimalMusicInfo
    onSongChange?: (text: string) => void
}

const FloatingPlayer = ({ songInfo, onSongChange }: FloatingPlayerProps) => {
    if (!songInfo) return null

    useEffect(() => {
        console.log(songInfo)
        console.log('Hi from floating player!')
    }, [songInfo])

    return (
        <View
            style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // alignSelf: 'center',
                position: 'absolute',
                bottom: 70,
                left: 0,
                height: 110,
                width: '100%',
                // backgroundColor: colors.text,
            }}
        >
            <Surface style={styles.surface} elevation={4} mode={'elevated'}>
                {songInfo.cover ? (
                    <Image source={{ uri: songInfo.cover }} style={{ ...styles.songCoverImage }} />
                ) : (
                    <MaterialIcons
                        name="art-track"
                        size={95}
                        style={{
                            color: colors.textMutedOpacity90Light,
                            backgroundColor: colors.textMutedOpacity30Light,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            ...styles.songCoverImage,
                        }}
                    />
                )}
                <View
                    style={{
                        flexDirection: 'column',
                        // backgroundColor: colors.text,
                        width: '60%',
                        // justifyContent: 'space-e',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FloatingPlayerText songInfoText={songInfo} />
                    <PlayerControls />
                </View>
            </Surface>
            <ProgressBar
                progress={0.1}
                style={{
                    borderRadius: 1000,
                    position: 'absolute',
                    height: 5,
                    width: '80%',
                    right: '-40%',
                    top: -5,
                }}
                theme={{
                    colors: { primary: 'red', surfaceVariant: colors.secondaryOpacity30 },
                }}
            />
        </View>
    )
}

export default FloatingPlayer

const styles = StyleSheet.create({
    surface: {
        width: '90%',
        height: '100%',
        flexDirection: 'row',
        // backgroundColor: colors.primary,
        borderRadius: 20,
    },
    textTicker: {},
    songCoverImage: {
        borderRadius: 8,
        width: 120,
        height: 120,
        left: '0%',
        bottom: 15,
        elevation: 10,
    },
})
