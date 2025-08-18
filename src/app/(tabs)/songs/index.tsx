import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { SongsList } from '@/components/SongsTab/SongsList'
import { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import searchFilter from '@/utils/filter'
import { colors } from '@/constants/tokens'
import FloatingSearchBar from '@/components/FloatingSearchBar/FloatingSearchBar'
import SearchButton from '@/components/FloatingSearchBar/SearchButton'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { useAudioPlayer } from 'expo-audio'

export default function () {
    // Get Data
    const mediaLibrary = useGetMediaLibrary()
    const { minimalMusicInfoList } = { ...mediaLibrary }

    // Search
    const [searchContent, setSearchContent] = useState('')
    const [searchFilters, setSearchFilters] = useState<string[]>(['Title'])
    const filteredSongs = useMemo(() => {
        if (!searchContent) return minimalMusicInfoList

        return searchFilter(minimalMusicInfoList, searchContent, searchFilters)
    }, [searchContent, minimalMusicInfoList, searchFilters])

    // Player
    const [songInfoPlaying, setSongInfoPlaying] = useState<MinimalMusicInfo>({
        id: '',
        title: '',
        artist: undefined,
        cover: undefined,
        lyrics: undefined,
        allLyricsLines: undefined,
        filename: '',
        uri: '',
    })
    const [songIdPlaying, setSongIdPlaying] = useState<string>('')
    const handleSongChange = (songId: string) => {
        setSongIdPlaying(songId)
        const minimalSongInfo = minimalMusicInfoList.find((song) => song.id === songId)
        if (minimalSongInfo) {
            setSongInfoPlaying(minimalSongInfo)
        }
    }
    const player = useAudioPlayer(songInfoPlaying.uri)
    useEffect(() => {
        player.play()
    }, [songInfoPlaying])

    // UI
    const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)

    // Index Component
    return (
        <View style={{ backgroundColor: colors.background, height: '100%' }}>
            <SafeAreaView
                style={{
                    ...defaultStyle.container,
                    backgroundColor: '#fff',
                    height: 'auto',
                }}
            >
                <View style={{ backgroundColor: '#fff', height: '100%' }}>
                    <FloatingSearchBar
                        visible={isSearchBarVisible}
                        searchContent={searchContent}
                        onSearchChange={setSearchContent}
                        searchFilters={searchFilters}
                        onSelectionChange={setSearchFilters}
                    />
                    <SearchButton visible={isSearchBarVisible} onPress={setIsSearchBarVisible} />
                    <SongsList
                        mediaLibrary={mediaLibrary}
                        filteredMusicInfoList={filteredSongs}
                        visible={isSearchBarVisible}
                        songIdPlaying={songIdPlaying}
                        onSongChange={handleSongChange}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}
