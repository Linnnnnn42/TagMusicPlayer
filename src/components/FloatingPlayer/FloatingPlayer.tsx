import { colors, paperThemeColors } from '@/constants/tokens'
import { Surface } from 'react-native-paper'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { FloatingPlayerText } from '@/components/FloatingPlayer/FloatingPlayerText'
import { Image } from 'expo-image'
import { FontAwesome6 } from '@expo/vector-icons'
import { AndroidImageColors } from 'react-native-image-colors/build/types'
import { PlayerProps } from '@/app/(tabs)/_layout'
import { playPauseButtonHandler } from '@/handler/playerHandler'

type FloatingPlayerProps = PlayerProps & {
    onFloatingPlayerPress?: () => void
    coverColorsSource?: AndroidImageColors | null
    coverColorsByLuminance?: { color: string; luminance: number; name: string; isLight: boolean }[]
}

const FloatingPlayer = ({
    songInfo,
    playerStatus,
    player,
    onFloatingPlayerPress,
    backgroundColor,
    lyricsTextColor,
    titleTextColor,
    coverColorsSource,
    coverColorsByLuminance,
    currentLyric,
}: FloatingPlayerProps) => {
    if (!songInfo) return null

    // Play/Pause
    const handlePlayPauseButton = playPauseButtonHandler

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
                {/*{coverColorsSource && <ColorsDisplay coverColors={coverColorsSource} />}*/}
                {/*{coverColorsByLuminance && <SortedColorsDisplay colors={coverColorsByLuminance} />}*/}

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
                                    level4: backgroundColor
                                        ? backgroundColor
                                        : paperThemeColors.elevation.level4,
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
                            onPress={() => handlePlayPauseButton(playerStatus, player)}
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
