import {
    getAllTagSong,
    tagSongCreator,
    tagSongDeleter,
    tagSongReader,
    tagSongUpdater,
} from '@/database/tagSongStorage'
import {
    songTagCreator,
    songTagDeleter,
    songTagReader,
    songTagUpdater,
} from '@/database/songTagStorage'

export const creator = {
    addTag(tagSongName: string, tagSongData?: Set<string>): void {
        tagSongCreator.addTagSong(tagSongName, tagSongData ? tagSongData : new Set<string>())
    },
    initSongTag: songTagCreator.initSongTag,
}

export const updater = {
    // Add one songId to the tag
    addSongToTag(songId: string, tagName: string): void {
        // (1) Update SongTag side
        // No need to validate the input tagName
        const tagsAttached = reader.getTagBySong(songId)
        tagsAttached.add(tagName)
        songTagUpdater.updateSongTag(songId, tagsAttached)

        // (2) Update TagSong side
        const songsSet = reader.getSongByTag(tagName)
        songsSet.add(songId)
        tagSongUpdater.updateTagSong(tagName, songsSet)
    },

    // Remove one songId from the tag
    removeSongFromTag(songId: string, tagName: string): void {
        // (1) Update SongTag side
        const tagsAttached = reader.getTagBySong(songId)
        tagsAttached.delete(tagName)
        songTagUpdater.updateSongTag(songId, tagsAttached)

        // (2) Update TagSong side
        const songsSet = reader.getSongByTag(tagName)
        songsSet.delete(songId)
        tagSongUpdater.updateTagSong(tagName, songsSet)
    },

    // Change tag's name
    updateTagSongName(tagSongOldName: string, tagSongNewName: string): void {
        // (1) Add new tag
        creator.addTag(tagSongNewName, reader.getSongByTag(tagSongOldName))
        // (2) Delete old tag
        deleter.deleteTag(tagSongOldName)
    },
}

export const reader = {
    getSongByTag(tagName: string): Set<string> {
        const songsSet = tagSongReader.getTagSong(tagName)
        if (songsSet === null) {
            throw new Error(`Fail to get song list by tag:${tagName}, song list not found`)
        }
        return songsSet
    },
    getTagBySong(songId: string): Set<string> {
        const tagsAttached = songTagReader.getSongTag(songId)
        if (tagsAttached === null) {
            throw new Error(`Fail to get song:${songId} to the tag, tag list not found`)
        }
        return tagsAttached
    },
    getAllTagSong: getAllTagSong,
}

export const deleter = {
    // Delete one tag
    deleteTag(tagName: string): void {
        // (1) Delete SongTag side
        const songsSet = reader.getSongByTag(tagName)
        songsSet.forEach((songId) => {
            const tagsAttached = reader.getTagBySong(songId)
            tagsAttached.delete(tagName)
            songTagUpdater.updateSongTag(songId, tagsAttached)
        })

        // (2) Delete TagSong side
        tagSongDeleter.deleteTagSong(tagName)
    },
    deleteSongTag: songTagDeleter.deleteSongTag,
}
