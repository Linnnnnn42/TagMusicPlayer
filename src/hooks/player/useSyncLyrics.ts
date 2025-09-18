import { MinimalMusicInfo } from '@/database/types'
import { AudioStatus } from 'expo-audio'
import { useEffect, useRef } from 'react'

// New hook for actively tracking lyric position
export const useSyncLyrics = (
    syncLyrics: MinimalMusicInfo['lyrics'],
    currentTime: AudioStatus['currentTime'],
    onLyricChange: (lyric: string) => void,
) => {
    const currentLyricIndex = useRef<number>(-1)
    const lyricsArray =
        syncLyrics && syncLyrics.length > 0 && syncLyrics[0].syncText ? syncLyrics[0].syncText : []

    useEffect(() => {
        if (!lyricsArray || lyricsArray.length === 0) {
            onLyricChange('')
            return
        }

        const currentTimestamp = Math.round((currentTime || 0) * 1000)

        // If it's initial state or time has gone back, re-find current lyric
        if (
            currentLyricIndex.current === -1 ||
            (lyricsArray[currentLyricIndex.current] &&
                (lyricsArray[currentLyricIndex.current]?.timestamp ?? 0) > currentTimestamp)
        ) {
            // Use binary search to find current lyric
            let left = 0
            let right = lyricsArray.length - 1
            currentLyricIndex.current = -1

            while (left <= right) {
                const mid = Math.floor((left + right) / 2)
                const lyric = lyricsArray[mid]

                if (lyric && lyric.timestamp !== undefined) {
                    if (lyric.timestamp <= currentTimestamp) {
                        currentLyricIndex.current = mid
                        left = mid + 1
                    } else {
                        right = mid - 1
                    }
                } else {
                    break
                }
            }
        } else {
            // Check if we need to update to the next lyric
            while (
                currentLyricIndex.current + 1 < lyricsArray.length &&
                lyricsArray[currentLyricIndex.current + 1] &&
                (lyricsArray[currentLyricIndex.current + 1]?.timestamp ?? 0) <= currentTimestamp
            ) {
                currentLyricIndex.current++
            }
        }

        // Get current lyric text
        const currentLyric = lyricsArray[currentLyricIndex.current]
        if (currentLyric) {
            onLyricChange(currentLyric.text === '' ? '........' : currentLyric.text)
        } else {
            onLyricChange('')
        }
    }, [currentTime, syncLyrics])
}
