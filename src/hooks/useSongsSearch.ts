import { useEffect, useMemo, useState } from 'react'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import searchFilter from '@/utils/filter'
import { GlobalMusicPlayerContextType } from '@/app/_layout'

const useSongsSearch = (mediaLibrary: GlobalMusicPlayerContextType['mediaLibrary']) => {
    // Get Data
    const { minimalMusicInfoList } = { ...mediaLibrary }

    // Search
    const [searchContent, setSearchContent] = useState('')
    const [searchFilters, setSearchFilters] = useState<string[]>(['Title'])
    const filteredSongs = useMemo(() => {
        if (!searchContent) return minimalMusicInfoList

        return searchFilter(minimalMusicInfoList, searchContent, searchFilters)
    }, [searchContent, minimalMusicInfoList, searchFilters])

    return {
        searchContent,
        setSearchContent,
        searchFilters,
        setSearchFilters,
        filteredSongs,
    }
}

export default useSongsSearch
