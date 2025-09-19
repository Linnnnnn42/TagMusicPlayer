import { MMKV } from 'react-native-mmkv'
import { keys } from '@/database/keys'
import { dbIds } from '@/database/dbIds'

const tagSongStorage = new MMKV({
    id: dbIds.tagSongStorageId,
})

const tagSongIndexKey = `${keys.TAG_SONG_INDEX_KEY}`
function buildTagSongKeyByName(name: string): string {
    return `${keys.TAG_SONG_PREFIX}${name}${keys.TAG_SONG_SUFFIX}`
}

function tagSongExists(name: string): boolean {
    const tagSongKey = buildTagSongKeyByName(name)
    return tagSongStorage.contains(tagSongKey)
}

const indexOperator = {
    initIndex(): void {
        try {
            const tagSongIndexData: string[] = []
            tagSongStorage.set(tagSongIndexKey, JSON.stringify(tagSongIndexData))
        } catch (error) {
            console.error('Error initializing tag index', error)
            throw error
        }
    },

    updateIndex(tagSongIndexData: Set<string>): void {
        try {
            tagSongStorage.set(tagSongIndexKey, JSON.stringify(Array.from(tagSongIndexData)))
        } catch (error) {
            console.error('Error updating tag index', error)
            throw error
        }
    },

    getIndex(): Set<string> {
        if (!this.indexExists()) {
            this.initIndex()
        }
        const existingIndexJSON = tagSongStorage.getString(tagSongIndexKey)
        const indexArray = existingIndexJSON ? JSON.parse(existingIndexJSON) : []
        return new Set(indexArray)
    },

    indexExists(): boolean {
        return tagSongStorage.contains(tagSongIndexKey)
    },
}

export function getAllTagSong(): Set<string> {
    return indexOperator.getIndex()
}

export const tagSongCreator = {
    addTagSong(tagSongName: string, tagSongData: Set<string>): void {
        if (tagSongName.length >= 25) {
            throw new Error('Invalid tagSong name, name too long, 25 characters limit')
        }

        if (tagSongExists(tagSongName)) {
            throw new Error(`TagSong with name "${tagSongName}" already exists`)
        }

        try {
            // Add new tagSong
            const tagSongKey = buildTagSongKeyByName(tagSongName)
            tagSongStorage.set(tagSongKey, JSON.stringify(Array.from(tagSongData)))

            // Update Index
            const tagSongIndex = indexOperator.getIndex()
            tagSongIndex.add(tagSongName)
            indexOperator.updateIndex(tagSongIndex)
        } catch (error) {
            console.error(`Error adding tagSong ${tagSongName}:`, error)
            throw error
        }
    },
}

export const tagSongUpdater = {
    updateTagSong(tagSongName: string, tagSongData: Set<string>): void {
        if (!tagSongExists(tagSongName)) {
            throw new Error(`TagSong with name "${tagSongName}" not found`)
        }
        try {
            const tagSongKey = buildTagSongKeyByName(tagSongName)
            tagSongStorage.set(tagSongKey, JSON.stringify(Array.from(tagSongData)))
        } catch (error) {
            console.error(`Error updating tagSong ${tagSongName}:`, error)
            throw error
        }
    },
}

export const tagSongReader = {
    getTagSong(name: string): Set<string> | null {
        try {
            const tagSongKey = buildTagSongKeyByName(name)
            const tagSongJSON = tagSongStorage.getString(tagSongKey)

            if (!tagSongJSON) {
                return null
            }

            const tagSongArray = JSON.parse(tagSongJSON) as string[]
            return new Set(tagSongArray)
        } catch (error) {
            console.error(`Error getting tagSong by name ${name}:`, error)
            return null
        }
    },
}

export const tagSongDeleter = {
    deleteTagSong(name: string): void {
        try {
            // Delete tagSong data
            const tagSongKey = buildTagSongKeyByName(name)
            tagSongStorage.delete(tagSongKey)

            // Update index
            const tagSongIndex = indexOperator.getIndex()
            if (tagSongIndex.size !== 0) {
                tagSongIndex.delete(name)
                indexOperator.updateIndex(tagSongIndex)
            }
        } catch (error) {
            console.error(`Error deleting tagSong ${name}:`, error)
            throw error
        }
    },
}
