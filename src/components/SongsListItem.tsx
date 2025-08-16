import { View, Text, StyleSheet, Pressable } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors, fontSize, fontWeight } from '@/constants/tokens'
import defaultStyle from '@/styles/style'
import { useState, memo } from 'react'
import { Image } from 'expo-image'

export type SongsListItemProps = {
    song: {
        id: string
        title: string
        cover?: string
        artist?: string
    }
}

export const SongsListItem = memo(
    ({ song }: SongsListItemProps) => {
        const [isActive, setActive] = useState(false)

        const onPressIn = () => {
            setActive(true)
        }

        const onPressOut = () => {
            setTimeout(() => {
                setActive(false)
            }, 0)
        }

        const onPress = () => {
            setActive(!isActive)
        }

        return (
            <Pressable
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 11,
                    backgroundColor: isActive ? colors.primaryOpacity10 : colors.background,
                }}
                android_ripple={{
                    color: colors.primaryOpacity30,
                    borderless: false,
                    foreground: true,
                }}
                // onPressIn={onPressIn}
                // onPressOut={onPressOut}
                onPress={onPress}
            >
                <View style={{ ...styles.songItemContainer }}>
                    <View>
                        {song.cover ? (
                            <Image
                                source={{ uri: song.cover }}
                                style={{ ...styles.songCoverImage }}
                            />
                        ) : (
                            <MaterialIcons
                                name="art-track"
                                size={40}
                                style={{
                                    color: colors.textMuted + '90',
                                    backgroundColor: colors.textMuted + '30',
                                    padding: 4,
                                    ...styles.songCoverImage,
                                }}
                            />
                        )}
                    </View>

                    <View style={{ width: '100%' }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                ...styles.songTitleText,
                                color: isActive ? colors.secondary : colors.text,
                            }}
                        >
                            {song.title}
                        </Text>

                        {song.artist && (
                            <Text numberOfLines={1} style={styles.songArtistText}>
                                {song.artist}
                            </Text>
                        )}
                    </View>
                </View>
            </Pressable>
        )
    },
    (prevProps, nextProps) => {
        return (
            prevProps.song.id === nextProps.song.id &&
            prevProps.song.title === nextProps.song.title &&
            prevProps.song.cover === nextProps.song.cover &&
            prevProps.song.artist === nextProps.song.artist
        )
    },
)

const styles = StyleSheet.create({
    songItemContainer: {
        flexDirection: 'row',
        columnGap: 14,
        alignItems: 'center',
        paddingRight: 20,
    },
    songCoverImage: {
        borderRadius: 8,
        width: 50,
        height: 50,
    },
    songTitleText: {
        ...defaultStyle.text,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.sixHundred,
        maxWidth: '90%',
    },
    songArtistText: {
        ...defaultStyle.text,
        color: colors.textMuted,
        fontSize: fontSize.xs,
        marginTop: 4,
    },
})
