import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { SongsList } from '@/components/SongsList'
import { useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import searchFilter from '@/utils/filter'
import { colors } from '@/constants/tokens'
import FloatingSearchBar from '@/components/FloatingSearchBar/FloatingSearchBar'
import SearchButton from '@/components/FloatingSearchBar/SearchButton'

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

    // UI
    const [visible, setVisible] = useState(false)

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
                        visible={visible}
                        searchContent={searchContent}
                        onSearchChange={setSearchContent}
                        searchFilters={searchFilters}
                        onSelectionChange={setSearchFilters}
                    />
                    <SearchButton visible={visible} onPress={setVisible} />
                    <SongsList
                        mediaLibrary={mediaLibrary}
                        filteredMusicInfoList={filteredSongs}
                        visible={visible}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}
