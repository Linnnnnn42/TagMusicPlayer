import { useCallback, useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { AnimatedFlashList, FlashList } from '@shopify/flash-list'
import { SongsListItem, SongsListItemProps } from '@/components/SongsListItem'
import { fontSize } from '@/constants/tokens'

type SongsListProps = {
    mediaLibrary: {
        loading: boolean
        length: number
        loadMusicLibrary: () => void
    }
    filteredMusicInfoList: SongsListItemProps['song'][]
    visible?: boolean
}

export const SongsList = ({
    mediaLibrary,
    filteredMusicInfoList,
    visible = true,
}: SongsListProps) => {
    const { loading, length, loadMusicLibrary } = {
        ...mediaLibrary,
    }

    const animation = useRef(new Animated.Value(visible ? 1 : 0)).current

    useEffect(() => {
        Animated.timing(animation, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: false, // Layout prop (paddingTop) cant use it， pref it later ...
        }).start()
    }, [visible])

    const paddingTop = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 125],
    })

    const renderItem = useCallback(
        ({ item: song }: { item: SongsListItemProps['song'] }) => <SongsListItem song={song} />,
        [],
    )

    return (
        <View style={{ flex: 1 }}>
            {/*<Button*/}
            {/*    title={loading ? `Loading...` : `${length} files found`}*/}
            {/*    onPress={loadMusicLibrary}*/}
            {/*    disabled={loading}*/}
            {/*    color={colors.primary}*/}
            {/*/>*/}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={{ fontSize: fontSize.medium }}>Loading...</Text>
                </View>
            ) : length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={{ fontSize: fontSize.medium }}>No files found</Text>
                </View>
            ) : (
                <AnimatedFlashList
                    data={filteredMusicInfoList}
                    renderItem={renderItem}
                    keyExtractor={(song) => song.id}
                    contentContainerStyle={{
                        paddingTop: paddingTop,
                        paddingBottom: 128,
                    }}
                    estimatedItemSize={66}
                    removeClippedSubviews={true}
                />
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
})
