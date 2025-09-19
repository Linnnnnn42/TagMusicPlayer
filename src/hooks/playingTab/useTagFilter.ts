import { useCallback, useEffect, useState } from 'react'
import * as tagDb from '@/database/songTagLinkedWrapper'
import { MinimalMusicInfo } from '@/database/types'
import { useMMKV, useMMKVListener } from 'react-native-mmkv'
import { dbIds } from '@/database/dbIds'

interface UseTagFilterProps {
    minimalMusicInfoList: MinimalMusicInfo[] | undefined
}

export const useTagFilter = ({ minimalMusicInfoList }: UseTagFilterProps) => {
    // Tag selection state
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
    const [filteredSongs, setFilteredSongs] = useState<MinimalMusicInfo[]>([])

    const updateFilteredSongs = useCallback(
        (selectedTagsSet: Set<string>) => {
            const mixedSongIdSet = new Set<string>()
            selectedTagsSet.forEach((tag) => {
                const songs = tagDb.reader.getSongByTag(tag)
                songs.forEach((songId) => mixedSongIdSet.add(songId))
            })

            const filteredSongs = minimalMusicInfoList
                ? minimalMusicInfoList.filter((song) => mixedSongIdSet.has(song.id))
                : []

            setFilteredSongs(filteredSongs)
        },
        [minimalMusicInfoList],
    )

    const songTagStorage = useMMKV({ id: dbIds.tagSongStorageId })
    useMMKVListener((tag) => {
        // Update filteredMinimalMusicInfoList when song tags change
        updateFilteredSongs(selectedTags)
    }, songTagStorage)

    // Update filteredMinimalMusicInfoList when selectedTags change
    useEffect(() => {
        updateFilteredSongs(selectedTags)
    }, [selectedTags, updateFilteredSongs])

    const toggleTagSelection = (tag: string) => {
        setSelectedTags((prev) => {
            const newSelected = new Set(prev)
            if (newSelected.has(tag)) {
                newSelected.delete(tag)
            } else {
                newSelected.add(tag)
            }
            return newSelected
        })
    }

    return {
        selectedTags,
        filteredSongs,
        toggleTagSelection,
    }
}
