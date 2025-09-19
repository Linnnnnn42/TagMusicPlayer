import { useCallback, useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, FlatList } from 'react-native'
import { SongsListItem, SongsListItemProps } from '@/components/SongsTab/SongsListItem'
import { colors, fontSize } from '@/constants/tokens'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Divider } from 'react-native-paper'
import { songListStyles } from '@/styles/style'

type SongsListProps = {
    loading: boolean
    filteredMusicInfoList: SongsListItemProps['song'][]
    visible?: boolean
    songIdPlaying?: string
    onSongChange?: (song: string) => void
}

export const SongsList = ({
    loading,
    filteredMusicInfoList,
    visible = true,
    songIdPlaying,
    onSongChange,
}: SongsListProps) => {
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
                <View style={songListStyles.loadingContainer}>
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
                                <View style={songListStyles.emptyContainer}>
                                    <Text style={{ fontSize: fontSize.medium }}>
                                        No songs found
                                    </Text>
                                    <MaterialIcons
                                        name="art-track"
                                        size={130}
                                        style={{
                                            ...songListStyles.songEmptyCoverImage,
                                        }}
                                    />
                                </View>
                            }
                            ItemSeparatorComponent={Divider}
                            // ListHeaderComponent={Divider}
                            // ListFooterComponent={Divider}
                        />
                    </Animated.View>
                </View>
            )}
        </View>
    )
}
