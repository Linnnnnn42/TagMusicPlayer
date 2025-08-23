import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { mediaLibraryContext } from '@/app/_layout'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'

const searchFilter = (
    songs: MinimalMusicInfo[] | undefined,
    searchContent: string,
    searchFilters: number[],
    t: TFunction<'translation', undefined>,
) => {
    let filteredSongList = songs ? [...songs] : []

    // console.log(searchFilters, searchContent, filteredSongList.length)

    // If content exists
    if (searchContent) {
        filteredSongList = filteredSongList.filter((song) => {
            // Check each filter and return true for any match
            return searchFilters.some((filter) => {
                switch (filter) {
                    case 0:
                        return songTitleFilter(searchContent)(song)
                    case 1:
                        return songArtistFilter(searchContent)(song)
                    case 2:
                        return songLyricsFilter(searchContent)(song)
                    default:
                        return false
                }
            })
        })
    }

    return filteredSongList
}

const songTitleFilter = (titleSearched: string) => (song: any) => {
    return song.title?.toLowerCase().includes(titleSearched.toLowerCase())
}

const songArtistFilter = (artistSearched: string) => (song: any) => {
    return song.artist?.toLowerCase().includes(artistSearched.toLowerCase())
}

const songLyricsFilter = (lyricsSearched: string) => (song: any) => {
    return song.allLyricsLines?.toLowerCase().includes(lyricsSearched.toLowerCase())
    // Need to remove all timestamps here
}

const useSongsSearch = () => {
    // Get Data
    const mediaLibrary = useContext(mediaLibraryContext)
    const { minimalMusicInfoList } = { ...mediaLibrary }
    const { t } = useTranslation()

    // Search
    const [searchContent, setSearchContent] = useState('')
    const [searchFilters, setSearchFilters] = useState<number[]>([0])
    const filteredSongs = useMemo(() => {
        if (!searchContent) return minimalMusicInfoList

        return searchFilter(minimalMusicInfoList, searchContent, searchFilters, t)
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
