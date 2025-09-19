import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { SongsListForSongTab } from '@/components/SongsList/SongsListForSongTab'
import { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/tokens'
import FloatingSearchBar from '@/components/FloatingSearchBar/FloatingSearchBar'
import SearchButton from '@/components/FloatingSearchBar/SearchButton'
import useSongsSearch from '@/hooks/songsTab/useSongsSearch'
import { mediaLibraryContext, musicPlayerContext } from '@/app/_layout'

export default function SongsTab() {
    // Get global context
    const musicPlayer = useContext(musicPlayerContext)
    const mediaLibrary = useContext(mediaLibraryContext)
    const loading = mediaLibrary?.loading || false

    // Search
    const songsSearch = useSongsSearch()
    const { searchContent, setSearchContent, searchFilters, setSearchFilters, filteredSongs } =
        songsSearch || {
            searchContent: '',
            setSearchContent: () => {},
            searchFilters: [],
            setSearchFilters: () => {},
            filteredSongs: [],
        }

    // BottomPlayer
    if (!musicPlayer) {
        throw new Error('useContext Fail')
    }
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
                    <SongsListForSongTab
                        loading={loading}
                        filteredMusicInfoList={filteredSongs || []}
                        visible={isSearchBarVisible}
                        songIdPlaying={songIdPlaying}
                        onSongChange={handleSongChange}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}
