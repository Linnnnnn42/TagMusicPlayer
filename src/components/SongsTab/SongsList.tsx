import { useCallback, useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, FlatList } from 'react-native'
import { SongsListItem, SongsListItemProps } from '@/components/SongsTab/SongsListItem'
import { colors, fontSize } from '@/constants/tokens'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Divider } from 'react-native-paper'

type SongsListProps = {
    mediaLibrary: {
        loading: boolean
        length: number
        loadMusicLibrary: () => void
    }
    filteredMusicInfoList: SongsListItemProps['song'][]
    visible?: boolean
    songIdPlaying?: string
    onSongChange?: (song: string) => void
}

export const SongsList = ({
    mediaLibrary,
    filteredMusicInfoList,
    visible = true,
    songIdPlaying,
    onSongChange,
}: SongsListProps) => {
    const { loading, length, loadMusicLibrary } = {
        ...mediaLibrary,
    }

    const animation = useRef(new Animated.Value(visible ? 1 : 0)).current

    useEffect(() => {
        Animated.timing(animation, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true, // Use native driver
        }).start()
    }, [visible])

    // translateY => Use native driver
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 130],
    })

    const renderItem = useCallback(
        ({ item: song }: { item: SongsListItemProps['song'] }) => (
            <SongsListItem song={song} songIdPlaying={songIdPlaying} onSongChange={onSongChange} />
        ),
        [onSongChange, songIdPlaying],
    )

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={{ fontSize: fontSize.medium }}>Loading...</Text>
                </View>
            ) : (
                <View style={{ flex: 1, overflow: 'hidden' }}>
                    <Animated.View
                        style={{
                            transform: [{ translateY }],
                            flex: 1,
                        }}
                    >
                        <FlatList
                            data={filteredMusicInfoList}
                            renderItem={renderItem}
                            keyExtractor={(song) => song.id}
                            contentContainerStyle={{
                                paddingBottom: 160,
                            }}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={{ fontSize: fontSize.medium }}>
                                        No songs found
                                    </Text>
                                    <MaterialIcons
                                        name="art-track"
                                        size={130}
                                        style={{
                                            ...styles.songEmptyCoverImage,
                                        }}
                                    />
                                </View>
                            }
                            ItemSeparatorComponent={Divider}
                            ListHeaderComponent={Divider}
                            ListFooterComponent={Divider}
                        />
                    </Animated.View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    songEmptyCoverImage: {
        borderRadius: 16,
        width: 150,
        height: 150,
        top: 35,
        color: colors.textMutedOpacity90Light,
        backgroundColor: colors.textMutedOpacity30Light,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
})
