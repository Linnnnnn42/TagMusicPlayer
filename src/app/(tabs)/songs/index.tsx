import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { SongsList } from '@/components/SongsTab/SongsList'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/tokens'
import FloatingSearchBar from '@/components/FloatingSearchBar/FloatingSearchBar'
import SearchButton from '@/components/FloatingSearchBar/SearchButton'
import useSongsSearch from '@/hooks/useSongsSearch'
import useGlobalMusicPlayer from '@/hooks/useGlobalMusicPlayer'

export default function () {
    // Get global context
    const { musicPlayer, mediaLibrary } = useGlobalMusicPlayer()

    // Search
    const songsSearch = useSongsSearch(mediaLibrary)
    const { searchContent, setSearchContent, searchFilters, setSearchFilters, filteredSongs } =
        songsSearch

    // Player
    const { songIdPlaying, handleSongChange } = musicPlayer

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
