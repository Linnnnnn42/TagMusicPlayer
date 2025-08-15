import { Button, FlatList, Text, View } from 'react-native'
import { songsTabStyles } from '@/styles/style'
import { SongsListItem } from '@/components/SongsListItem'
import { colors, fontSize } from '@/constants/tokens'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'

export const SongsList = () => {
    const { loading, length, musicInfoList, loadMusicLibrary } = useGetMediaLibrary()

    return (
        <View style={{ flex: 1 }}>
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
                    data={musicInfoList}
                    renderItem={({ item: song }) => <SongsListItem song={song} />}
                    keyExtractor={(song) => song.id}
                />
            )}
            <Button
                title={loading ? `Loading...` : `${length} files found`}
                onPress={loadMusicLibrary}
                disabled={loading}
                color={colors.primary}
            />
        </View>
    )
}
