import { Button, Text, View } from 'react-native'
import { songsTabStyles } from '@/styles/style'
import { SongsListItem, SongsListItemProps } from '@/components/SongsListItem'
import { colors, fontSize } from '@/constants/tokens'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { useCallback } from 'react'
import { FlashList } from '@shopify/flash-list'

type SongsListProps = {
    mediaLibrary?: ReturnType<typeof useGetMediaLibrary>
    filteredMusicInfoList?: any[]
}

export const SongsList = ({ mediaLibrary, filteredMusicInfoList }: SongsListProps) => {
    const { loading, length, loadMusicLibrary } = {
        ...mediaLibrary,
    }

    const renderItem = useCallback(
        ({ item: song }: { item: SongsListItemProps['song'] }) => <SongsListItem song={song} />,
        [],
    )

    return (
        <View style={{ flex: 1 }}>
            <Button
                title={loading ? `Loading...` : `${length} files found`}
                onPress={loadMusicLibrary}
                disabled={loading}
                color={colors.primary}
            />
            {loading ? (
                <View style={songsTabStyles.loadingContainer}>
                    {/*<Text style={{ fontSize: fontSize.medium }}>Loading...</Text>*/}
                </View>
            ) : length === 0 ? (
                <View style={songsTabStyles.emptyContainer}>
                    <Text style={{ fontSize: fontSize.medium }}>No files found</Text>
                </View>
            ) : (
                <FlashList
                    data={filteredMusicInfoList}
                    renderItem={renderItem}
                    keyExtractor={(song) => song.id}
                    contentContainerStyle={{
                        paddingTop: 10,
                        paddingBottom: 128,
                    }}
                    estimatedItemSize={66}
                    removeClippedSubviews={true}
                />
            )}
        </View>
    )
}
