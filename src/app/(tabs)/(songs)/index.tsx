import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { SongsList } from '@/components/SongsList'
import { useMemo } from 'react'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { songTitleFilter } from '@/utils/filter'

export default function () {
    const search = useNavigationSearch({
        searchBarOptions: {
            placeholder: 'Find in songs',
        },
    })

    const mediaLibrary = useGetMediaLibrary()
    const { minimalMusicInfoList } = { ...mediaLibrary }

    const filteredSongs = useMemo(() => {
        if (!search) return minimalMusicInfoList

        return minimalMusicInfoList.filter(songTitleFilter(search))
    }, [search, minimalMusicInfoList])

    return (
        <View style={defaultStyle.container}>
            <SongsList mediaLibrary={mediaLibrary} filteredMusicInfoList={filteredSongs} />
        </View>
    )
}
