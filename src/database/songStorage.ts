import { MMKV } from 'react-native-mmkv'
import { keys } from './keys'
import { MinimalMusicInfo, MusicInfo } from '@/database/types'

// Create dedicated MMKV instance for song storage
const songStorage = new MMKV({
    id: 'song-storage',
})

/**
 * Get song index
 */
export function getSongIndex(): string[] {
    const existingIndexJSON = songStorage.getString(keys.SONG_INDEX_KEY)
    return existingIndexJSON ? JSON.parse(existingIndexJSON) : []
}

/**
 * Get minimal song index
 */
function getMinimalSongIndex(): string[] {
    const existingIndexJSON = songStorage.getString(keys.MINIMAL_SONG_INDEX_KEY)
    return existingIndexJSON ? JSON.parse(existingIndexJSON) : []
}

/**
 * Update song index
 */
function updateSongIndex(songIndexArray: string[]) {
    songStorage.set(keys.SONG_INDEX_KEY, JSON.stringify(songIndexArray))
}

/**
 * Update minimal song index
 */
function updateMinimalSongIndex(songIndexArray: string[]) {
    songStorage.set(keys.MINIMAL_SONG_INDEX_KEY, JSON.stringify(songIndexArray))
}

/**
 * Group of functions for creating songs
 */
export const songCreator = {
    /**
     * Add or update multiple songs in storage
     * Uses batch processing for better performance
     */
    addOrUpdateSongs(songs: MusicInfo[]): void {
        try {
            // Get existing index
            let songIndexArray: string[] = getSongIndex()

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
            updateSongIndex(songIndexArray)
        } catch (error) {
            console.error('Error adding/updating songs:', error)
            throw error
        }
    },

    /**
     * Add or update multiple minimal songs in storage
     */
    addOrUpdateMinimalSongs(songs: MinimalMusicInfo[]): void {
        try {
            // Get existing index
            let songIndexArray: string[] = getMinimalSongIndex()

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
            updateMinimalSongIndex(songIndexArray)
        } catch (error) {
            console.error('Error adding/updating minimal songs:', error)
            throw error
        }
    },

    /**
     * Update a single song (more efficient than addOrUpdate for single updates)
     */
    updateSong(song: MusicInfo): void {
        try {
            const songKey = `${keys.SONG_PREFIX}${song.id}`
            songStorage.set(songKey, JSON.stringify(song))
        } catch (error) {
            console.error(`Error updating song ${song.id}:`, error)
            throw error
        }
    },

    /**
     * Update a single minimal song
     */
    updateMinimalSong(song: MinimalMusicInfo): void {
        try {
            const songKey = `${keys.MINIMAL_SONG_PREFIX}${song.id}`
            songStorage.set(songKey, JSON.stringify(song))
        } catch (error) {
            console.error(`Error updating minimal song ${song.id}:`, error)
            throw error
        }
    },
}

/**
 * Group of functions for updating songs
 */
export const songUpdater = {
    /**
     * Update a single song (more efficient than addOrUpdate for single updates)
     */
    updateSong: songCreator.updateSong,

    /**
     * Update a single minimal song
     */
    updateMinimalSong: songCreator.updateMinimalSong,

    /**
     * Add or update multiple songs in storage
     * Uses batch processing for better performance
     */
    addOrUpdateSongs: songCreator.addOrUpdateSongs,

    /**
     * Add or update multiple minimal songs in storage
     */
    addOrUpdateMinimalSongs: songCreator.addOrUpdateMinimalSongs,
}

/**
 * Group of functions for reading songs
 */
export const songReader = {
    /**
     * Get a single song by ID
     */
    getSongById(id: string): MusicInfo | null {
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
    },

    /**
     * Get a single minimal song by ID
     */
    getMinimalSongById(id: string): MinimalMusicInfo | null {
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
    },

    /**
     * Get all songs from storage
     */
    getAllSongs(): MusicInfo[] {
        try {
            const songIds: string[] = getSongIndex()
            if (songIds.length === 0) {
                return []
            }

            const songs: MusicInfo[] = []
            for (const id of songIds) {
                const song = this.getSongById(id)
                if (song) {
                    songs.push(song)
                }
            }

            return songs
        } catch (error) {
            console.error('Error getting all songs:', error)
            return []
        }
    },

    /**
     * Get all minimal songs from storage
     */
    getAllMinimalSongs(): MinimalMusicInfo[] {
        try {
            const songIds: string[] = getMinimalSongIndex()
            if (songIds.length === 0) {
                return []
            }

            const songs: MinimalMusicInfo[] = []
            for (const id of songIds) {
                const song = this.getMinimalSongById(id)
                if (song) {
                    songs.push(song)
                }
            }

            return songs
        } catch (error) {
            console.error('Error getting all minimal songs:', error)
            return []
        }
    },

    /**
     * Get song count
     */
    getSongCount(): number {
        try {
            const songIds: string[] = getSongIndex()
            return songIds.length
        } catch (error) {
            console.error('Error getting song count:', error)
            return 0
        }
    },

    /**
     * Get minimal song count
     */
    getMinimalSongCount(): number {
        try {
            const songIds: string[] = getMinimalSongIndex()
            return songIds.length
        } catch (error) {
            console.error('Error getting minimal song count:', error)
            return 0
        }
    },

    /**
     * Check if song exists
     */
    songExists(id: string): boolean {
        const songKey = `${keys.SONG_PREFIX}${id}`
        return songStorage.contains(songKey)
    },

    /**
     * Check if minimal song exists
     */
    minimalSongExists(id: string): boolean {
        const songKey = `${keys.MINIMAL_SONG_PREFIX}${id}`
        return songStorage.contains(songKey)
    },
}

/**
 * Group of functions for deleting songs
 */
export const songDeleter = {
    /**
     * Delete a song by ID
     */
    deleteSong(id: string): void {
        try {
            // Delete song data
            const songKey = `${keys.SONG_PREFIX}${id}`
            songStorage.delete(songKey)

            // Update index
            let songIndexArray = getSongIndex()
            if (songIndexArray.length !== 0) {
                songIndexArray = songIndexArray.filter((songId) => songId !== id)
                updateSongIndex(songIndexArray)
            }
        } catch (error) {
            console.error(`Error deleting song ${id}:`, error)
            throw error
        }
    },

    /**
     * Delete a minimal song by ID
     */
    deleteMinimalSong(id: string): void {
        try {
            // Delete song data
            const songKey = `${keys.MINIMAL_SONG_PREFIX}${id}`
            songStorage.delete(songKey)

            // Update index
            let songIndexArray = getMinimalSongIndex()
            if (songIndexArray.length !== 0) {
                songIndexArray = songIndexArray.filter((songId) => songId !== id)
                updateMinimalSongIndex(songIndexArray)
            }
        } catch (error) {
            console.error(`Error deleting minimal song ${id}:`, error)
            throw error
        }
    },

    /**
     * Clear all songs from storage
     */
    clearAllSongs(): void {
        try {
            // Get all song IDs
            const songIds: string[] = getSongIndex()
            if (songIds) {
                // Delete all individual songs
                for (const id of songIds) {
                    const songKey = `${keys.SONG_PREFIX}${id}`
                    songStorage.delete(songKey)
                }

                // Delete index
                songStorage.delete(keys.SONG_INDEX_KEY)
            }

            // Clear minimal songs too
            const songIdsMinimal: string[] = getMinimalSongIndex()
            if (songIdsMinimal) {
                for (const id of songIdsMinimal) {
                    const songKey = `${keys.MINIMAL_SONG_PREFIX}${id}`
                    songStorage.delete(songKey)
                }

                songStorage.delete(keys.MINIMAL_SONG_INDEX_KEY)
            }
        } catch (error) {
            console.error('Error clearing all songs:', error)
            throw error
        }
    },
}
