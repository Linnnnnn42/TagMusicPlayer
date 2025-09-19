import { useCallback, useEffect, useState } from 'react'
import * as tagDb from '@/database/songTagLinkedWrapper'
import { MinimalMusicInfo } from '@/database/types'
import { useMMKV, useMMKVListener } from 'react-native-mmkv'
import { dbIds } from '@/database/dbIds'
import { readPlayingTagStates, updatePlayingTagStates } from '@/database/envStorage'

export type TagFilterState = 'include' | 'exclude' | 'neutral'

interface UseTagFilterProps {
    minimalMusicInfoList: MinimalMusicInfo[] | undefined
    tagManagementLoading: boolean
}

export const useTagFilter = ({ minimalMusicInfoList, tagManagementLoading }: UseTagFilterProps) => {
    // Loading state
    const [loading, setLoading] = useState(true)

    // Tag selection state - changed to support three states
    const [tagStates, setTagStates] = useState<Record<string, TagFilterState>>({})
    const [filteredSongs, setFilteredSongs] = useState<MinimalMusicInfo[]>([])

    const updateFilteredSongs = useCallback(
        (tagStateRecord: Record<string, TagFilterState>) => {
            // Get included and excluded tags
            const includedTags: string[] = []
            const excludedTags: string[] = []
            Object.entries(tagStateRecord).forEach(([tag, state]) => {
                if (state === 'include') {
                    includedTags.push(tag)
                } else if (state === 'exclude') {
                    excludedTags.push(tag)
                }
            })

            // Get songs for included tags
            const includedSongIdSet = new Set<string>()
            includedTags.forEach((tag) => {
                const songs = tagDb.reader.getSongByTag(tag)
                songs.forEach((songId) => includedSongIdSet.add(songId))
            })

            // Get songs for excluded tags
            const excludedSongIdSet = new Set<string>()
            excludedTags.forEach((tag) => {
                const songs = tagDb.reader.getSongByTag(tag)
                songs.forEach((songId) => excludedSongIdSet.add(songId))
            })

            // Filter songs based on inclusion and exclusion rules
            const filteredSongs = minimalMusicInfoList
                ? minimalMusicInfoList.filter((song) => {
                      // If explicitly excluded, don't include
                      if (excludedSongIdSet.has(song.id)) {
                          return false
                      }

                      // If there are included tags, only include songs that match at least one
                      if (includedTags.length > 0) {
                          return includedSongIdSet.has(song.id)
                      }

                      // If no included tags, include all that aren't excluded
                      return true
                  })
                : []

            setFilteredSongs(filteredSongs)
        },
        [minimalMusicInfoList],
    )

    const songTagStorage = useMMKV({ id: dbIds.tagSongStorageId })
    useMMKVListener((tag) => {
        // Update filteredMinimalMusicInfoList when tags attached to one song change
        // console.log(`${tag} changed!!!`)
        updateFilteredSongs(tagStates)
    }, songTagStorage)

    // Update filteredMinimalMusicInfoList when tagStates change
    useEffect(() => {
        updateFilteredSongs(tagStates)
    }, [tagStates, updateFilteredSongs])

    const updateTagState = (tag: string, state: TagFilterState) => {
        setTagStates((prev) => {
            const newStates = { ...prev, [tag]: state }
            // Save tag status into database
            updatePlayingTagStates(newStates)
            return newStates
        })
    }

    // Recover last time's playingSelectedTags
    useEffect(() => {
        if (!tagManagementLoading) {
            // Try reading the last saved tag status
            const lastPlayingTagStates = readPlayingTagStates()
            if (lastPlayingTagStates !== null) {
                setTagStates(lastPlayingTagStates)
                setLoading(false)
                return
            }

            // If not, set to empty and save
            setTagStates({})
            updatePlayingTagStates({})
            setLoading(false)
        }
    }, [tagManagementLoading])

    return {
        loading,
        tagStates,
        filteredSongs,
        updateTagState,
    }
}
