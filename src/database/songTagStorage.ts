import { MMKV } from 'react-native-mmkv'
import { keys } from '@/database/keys'

const songTagStorage = new MMKV({
    id: 'song-tag-storage',
})

function buildSongTagKeyById(id: string): string {
    return `${keys.SONG_TAG_PREFIX}${id}${keys.SONG_TAG_SUFFIX}`
}

export const songTagCreator = {
    initSongTag(songTagId: string): void {
        try {
            songTagUpdater.updateSongTag(songTagId, new Set<string>())
        } catch (error) {
            console.error(`Error initializing songTag ${songTagId}:`, error)
            throw error
        }
    },
}

export const songTagUpdater = {
    updateSongTag(songTagId: string, songTagData: Set<string>): void {
        try {
            const songTagKey = buildSongTagKeyById(songTagId)
            songTagStorage.set(songTagKey, JSON.stringify(Array.from(songTagData)))
        } catch (error) {
            console.error(`Error updating songTag ${songTagId}:`, error)
            throw error
        }
    },
}

export const songTagReader = {
    getSongTag(id: string): Set<string> | null {
        try {
            const songTagKey = buildSongTagKeyById(id)
            const songTagJSON = songTagStorage.getString(songTagKey)

            if (!songTagJSON) {
                return null
            }

            const songTagArray = JSON.parse(songTagJSON) as string[]
            return new Set<string>(songTagArray)
        } catch (error) {
            console.error(`Error getting songTag by name ${id}:`, error)
            return null
        }
    },
}

export const songTagDeleter = {
    deleteSongTag(id: string): void {
        try {
            const songTagKey = buildSongTagKeyById(id)
            songTagStorage.delete(songTagKey)
        } catch (error) {
            console.error(`Error deleting songTag ${id}:`, error)
            throw error
        }
    },
}
