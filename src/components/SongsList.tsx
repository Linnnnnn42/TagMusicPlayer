import { Button, FlatList, Text, View } from 'react-native'
import { songsTabStyles } from '@/styles/style'
import { SongsListItem } from '@/components/SongsListItem'
import { colors, fontSize } from '@/constants/tokens'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'

type SongsListProps = {
    mediaLibrary?: ReturnType<typeof useGetMediaLibrary>
    filteredMusicInfoList?: any[]
}

export const SongsList = ({ mediaLibrary, filteredMusicInfoList }: SongsListProps) => {
    const { loading, length, musicInfoList, minimalMusicInfoList, loadMusicLibrary } = {
        ...mediaLibrary,
    }

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
                <FlatList
                    data={filteredMusicInfoList}
                    renderItem={({ item: song }) => <SongsListItem song={song} />}
                    keyExtractor={(song) => song.id}
                    contentContainerStyle={{
                        paddingTop: 10,
                        paddingBottom: 128,
                    }}
                />
            )}
        </View>
    )
}
