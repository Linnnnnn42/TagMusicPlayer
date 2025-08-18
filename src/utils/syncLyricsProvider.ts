import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { AudioStatus } from 'expo-audio'

export const syncLyricsProvider = (
    syncLyrics: MinimalMusicInfo['lyrics'],
    currentTime: AudioStatus['currentTime'],
) => {
    const currentTimestamp = Math.round(currentTime * 1000)

    // Find the currently playing lyrics
    if (syncLyrics && syncLyrics.length > 0 && syncLyrics[0].syncText) {
        const lyricsArray = syncLyrics[0].syncText

        // Use binary search to find the last lyric with timestamp less than or equal to the current timestamp
        let currentLyric = null
        let left = 0
        let right = lyricsArray.length - 1

        while (left <= right) {
            const mid = Math.floor((left + right) / 2)
            const lyric = lyricsArray[mid]

            if (lyric && lyric.timestamp !== undefined) {
                if (lyric.timestamp <= currentTimestamp) {
                    currentLyric = lyric
                    left = mid + 1
                } else {
                    right = mid - 1
                }
            } else {
                break
            }
        }

        // Output the currently playing lyrics to the console
        if (currentLyric) {
            if (currentLyric.text === '') {
                return '........'
            } else {
                return currentLyric.text
            }
        } else {
            return 'No lyrics available'
        }
    }

    return 'No lyrics available'
}
