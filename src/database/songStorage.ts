import { MMKV } from 'react-native-mmkv'
import { keys } from './keys'
import { MusicInfo, MinimalMusicInfo } from '@/database/types'

// Create dedicated MMKV instance for song storage
const songStorage = new MMKV({
    id: 'song-storage',
})

/**
 * Add or update multiple songs in storage
 * Uses batch processing for better performance
 */
export function addOrUpdateSongs(songs: MusicInfo[]): void {
    try {
        // Get existing index
        const existingIndexJSON = songStorage.getString(keys.SONG_INDEX_KEY)
        let songIndexArray: string[] = existingIndexJSON ? JSON.parse(existingIndexJSON) : []

        // Process songs in batches for better performance
        const batchSize = 100
        for (let i = 0; i < songs.length; i += batchSize) {
            const batch = songs.slice(i, i + batchSize)

            batch.forEach((song) => {
                // Store individual song with prefix
                const songKey = `${keys.SONG_PREFIX}${song.id}`
                songStorage.set(songKey, JSON.stringify(song))

                // Add to index if not exists
                if (!songIndexArray.includes(song.id)) {
                    songIndexArray.push(song.id)
                }
            })
        }

        // Update index
        songStorage.set(keys.SONG_INDEX_KEY, JSON.stringify(songIndexArray))
    } catch (error) {
        console.error('Error adding/updating songs:', error)
        throw error
    }
}

/**
 * Add or update multiple minimal songs in storage
 */
export function addOrUpdateMinimalSongs(songs: MinimalMusicInfo[]): void {
    try {
        // Get existing index
        const existingIndexJSON = songStorage.getString(keys.MINIMAL_SONG_INDEX_KEY)
        let songIndexArray: string[] = existingIndexJSON ? JSON.parse(existingIndexJSON) : []

        // Process songs in batches
        const batchSize = 100
        for (let i = 0; i < songs.length; i += batchSize) {
            const batch = songs.slice(i, i + batchSize)

            batch.forEach((song) => {
                // Store individual minimal song with prefix
                const songKey = `${keys.MINIMAL_SONG_PREFIX}${song.id}`
                songStorage.set(songKey, JSON.stringify(song))

                // Add to index if not exists
                if (!songIndexArray.includes(song.id)) {
                    songIndexArray.push(song.id)
                }
            })
        }

        // Update index
        songStorage.set(keys.MINIMAL_SONG_INDEX_KEY, JSON.stringify(songIndexArray))
    } catch (error) {
        console.error('Error adding/updating minimal songs:', error)
        throw error
    }
}

/**
 * Get a single song by ID
 */
export function getSongById(id: string): MusicInfo | null {
    try {
        const songKey = `${keys.SONG_PREFIX}${id}`
        const songJSON = songStorage.getString(songKey)

        if (!songJSON) {
            return null
        }

        return JSON.parse(songJSON) as MusicInfo
    } catch (error) {
        console.error(`Error getting song by ID ${id}:`, error)
        return null
    }
}

/**
 * Get a single minimal song by ID
 */
export function getMinimalSongById(id: string): MinimalMusicInfo | null {
    try {
        const songKey = `${keys.MINIMAL_SONG_PREFIX}${id}`
        const songJSON = songStorage.getString(songKey)

        if (!songJSON) {
            return null
        }

        return JSON.parse(songJSON) as MinimalMusicInfo
    } catch (error) {
        console.error(`Error getting minimal song by ID ${id}:`, error)
        return null
    }
}

/**
 * Get all songs from storage
 */
export function getAllSongs(): MusicInfo[] {
    try {
        const indexJSON = songStorage.getString(keys.SONG_INDEX_KEY)
        if (!indexJSON) {
            return []
        }

        const songIds: string[] = JSON.parse(indexJSON)

        const songs: MusicInfo[] = []
        for (const id of songIds) {
            const song = getSongById(id)
            if (song) {
                songs.push(song)
            }
        }

        return songs
    } catch (error) {
        console.error('Error getting all songs:', error)
        return []
    }
}

/**
 * Get all minimal songs from storage
 */
export function getAllMinimalSongs(): MinimalMusicInfo[] {
    try {
        const indexJSON = songStorage.getString(keys.MINIMAL_SONG_INDEX_KEY)
        if (!indexJSON) {
            return []
        }

        const songIds: string[] = JSON.parse(indexJSON)

        const songs: MinimalMusicInfo[] = []
        for (const id of songIds) {
            const song = getMinimalSongById(id)
            if (song) {
                songs.push(song)
            }
        }

        return songs
    } catch (error) {
        console.error('Error getting all minimal songs:', error)
        return []
    }
}

/**
 * Update a single song (more efficient than addOrUpdate for single updates)
 */
export function updateSong(song: MusicInfo): void {
    try {
        const songKey = `${keys.SONG_PREFIX}${song.id}`
        songStorage.set(songKey, JSON.stringify(song))
    } catch (error) {
        console.error(`Error updating song ${song.id}:`, error)
        throw error
    }
}

/**
 * Update a single minimal song
 */
export function updateMinimalSong(song: MinimalMusicInfo): void {
    try {
        const songKey = `${keys.MINIMAL_SONG_PREFIX}${song.id}`
        songStorage.set(songKey, JSON.stringify(song))
    } catch (error) {
        console.error(`Error updating minimal song ${song.id}:`, error)
        throw error
    }
}

/**
 * Delete a song by ID
 */
export function deleteSong(id: string): void {
    try {
        // Delete song data
        const songKey = `${keys.SONG_PREFIX}${id}`
        songStorage.delete(songKey)

        // Update index
        const indexJSON = songStorage.getString(keys.SONG_INDEX_KEY)
        if (indexJSON) {
            let songIndexArray: string[] = JSON.parse(indexJSON)
            songIndexArray = songIndexArray.filter((songId) => songId !== id)
            songStorage.set(keys.SONG_INDEX_KEY, JSON.stringify(songIndexArray))
        }
    } catch (error) {
        console.error(`Error deleting song ${id}:`, error)
        throw error
    }
}

/**
 * Delete a minimal song by ID
 */
export function deleteMinimalSong(id: string): void {
    try {
        // Delete song data
        const songKey = `${keys.MINIMAL_SONG_PREFIX}${id}`
        songStorage.delete(songKey)

        // Update index
        const indexJSON = songStorage.getString(keys.MINIMAL_SONG_INDEX_KEY)
        if (indexJSON) {
            let songIndexArray: string[] = JSON.parse(indexJSON)
            songIndexArray = songIndexArray.filter((songId) => songId !== id)
            songStorage.set(keys.MINIMAL_SONG_INDEX_KEY, JSON.stringify(songIndexArray))
        }
    } catch (error) {
        console.error(`Error deleting minimal song ${id}:`, error)
        throw error
    }
}

/**
 * Clear all songs from storage
 */
export function clearAllSongs(): void {
    try {
        // Get all song IDs
        const indexJSON = songStorage.getString(keys.SONG_INDEX_KEY)
        if (indexJSON) {
            const songIds: string[] = JSON.parse(indexJSON)

            // Delete all individual songs
            for (const id of songIds) {
                const songKey = `${keys.SONG_PREFIX}${id}`
                songStorage.delete(songKey)
            }

            // Delete index
            songStorage.delete(keys.SONG_INDEX_KEY)
        }

        // Clear minimal songs too
        const minimalIndexJSON = songStorage.getString(keys.MINIMAL_SONG_INDEX_KEY)
        if (minimalIndexJSON) {
            const songIds: string[] = JSON.parse(minimalIndexJSON)

            for (const id of songIds) {
                const songKey = `${keys.MINIMAL_SONG_PREFIX}${id}`
                songStorage.delete(songKey)
            }

            songStorage.delete(keys.MINIMAL_SONG_INDEX_KEY)
        }
    } catch (error) {
        console.error('Error clearing all songs:', error)
        throw error
    }
}

/**
 * Get song count
 */
export function getSongCount(): number {
    try {
        const indexJSON = songStorage.getString(keys.SONG_INDEX_KEY)
        if (!indexJSON) {
            return 0
        }

        const songIds: string[] = JSON.parse(indexJSON)
        return songIds.length
    } catch (error) {
        console.error('Error getting song count:', error)
        return 0
    }
}

/**
 * Get minimal song count
 */
export function getMinimalSongCount(): number {
    try {
        const indexJSON = songStorage.getString(keys.MINIMAL_SONG_INDEX_KEY)
        if (!indexJSON) {
            return 0
        }

        const songIds: string[] = JSON.parse(indexJSON)
        return songIds.length
    } catch (error) {
        console.error('Error getting minimal song count:', error)
        return 0
    }
}

/**
 * Check if song exists
 */
export function songExists(id: string): boolean {
    const songKey = `${keys.SONG_PREFIX}${id}`
    return songStorage.contains(songKey)
}

/**
 * Check if minimal song exists
 */
export function minimalSongExists(id: string): boolean {
    const songKey = `${keys.MINIMAL_SONG_PREFIX}${id}`
    return songStorage.contains(songKey)
}
