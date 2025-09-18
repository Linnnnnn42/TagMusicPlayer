import { View, Text, StyleSheet, Pressable } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors, fontSize, fontWeight } from '@/constants/tokens'
import defaultStyle from '@/styles/style'
import { useState, memo, useEffect } from 'react'
import { Image } from 'expo-image'

export type SongsListItemProps = {
    song: {
        id: string
        title: string
        cover?: string
        artist?: string
    }
    songIdPlaying?: string
    onSongChange?: (songId: string) => void
}

export const SongsListItem = memo(
    ({ song, songIdPlaying, onSongChange }: SongsListItemProps) => {
        const [isActive, setActive] = useState(false)
        const [isChanging, setIsChanging] = useState(false)

        useEffect(() => {
            setActive(songIdPlaying === song.id)
            setIsChanging(false)
        }, [songIdPlaying])

        const onPress = () => {
            if (!isActive) {
                setIsChanging(true)
            }
            onSongChange?.(song.id)
        }

        return (
            <Pressable
                style={{
                    paddingVertical: 15,
                    paddingLeft: '5%',
                    backgroundColor: isActive ? colors.primaryOpacity10 : colors.background,
                }}
                android_ripple={{
                    color: colors.primaryOpacity30,
                    borderless: false,
                    foreground: true,
                }}
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
                                    color: colors.textMutedOpacity90Light,
                                    backgroundColor: colors.textMutedOpacity30Light,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    ...styles.songCoverImage,
                                }}
                            />
                        )}
                    </View>

                    <View style={{ width: '70%' }}>
                        <Text
                            numberOfLines={2}
                            style={{
                                ...styles.songTitleText,
                                color: isActive
                                    ? colors.secondary
                                    : isChanging
                                      ? colors.secondary
                                      : colors.text,
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
            prevProps.song.artist === nextProps.song.artist &&
            prevProps.songIdPlaying === nextProps.songIdPlaying
        )
    },
)

const styles = StyleSheet.create({
    songItemContainer: {
        flexDirection: 'row',
        columnGap: 14,
        alignItems: 'center',
        // paddingRight: 20,
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
