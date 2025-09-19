import { useState, useEffect } from 'react'
import * as tagDb from '@/database/songTagLinkedWrapper'
import { getSongIndex } from '@/database/songStorage'

export const useTagManagement = (mediaLibraryLoading: boolean) => {
    const [loading, setLoading] = useState(true)

    const [tags, setTags] = useState<string[]>([])
    const [tagsMasks, setTagsMasks] = useState<Map<string, boolean[]>>(new Map([['', [false]]]))

    const loadTags = () => {
        try {
            const tagSet = tagDb.reader.getAllTagSong()
            setTags(Array.from(tagSet))
        } catch (error) {
            console.error('Failed to load tags:', error)
            setTags([])
        }
    }

    const addTag = (tagName: string) => {
        if (!tagName.trim()) {
            throw new Error('Tag name cannot be empty')
        }

        if (tags.includes(tagName.trim())) {
            throw new Error('Tag already exists')
        }

        tagDb.creator.addTag(tagName.trim())
        loadTags()
    }

    const deleteTag = (tagName: string) => {
        tagDb.deleter.deleteTag(tagName)
        loadTags()
    }

    const loadTagsMask = (songId: string) => {
        return new Promise<void>((resolve) => {
            try {
                const tagAttachedSet = tagDb.reader.getTagBySong(songId)
                const tagArray = tags
                const tagAttachedArray: boolean[] = new Array(tagArray.length)
                tagArray.forEach((tag, index) => {
                    if (tagAttachedSet.has(tag)) {
                        tagAttachedArray[index] = true
                    }
                })
                const newTagsMasks = tagsMasks
                newTagsMasks.set(songId, tagAttachedArray)
                setTagsMasks(newTagsMasks)
            } catch (error) {
                console.error('Failed to load tagsMask:', error)
                const newTagsMasks = tagsMasks
                newTagsMasks.set(songId, [false])
                setTagsMasks(newTagsMasks)
            } finally {
                resolve()
            }
        })
    }

    const loadAllTagsMask = async (songIdList: string[]) => {
        const promises = songIdList.map((songId) => loadTagsMask(songId))
        await Promise.all(promises)
    }

    const addTagMask = (songId: string, tagName: string) => {
        tagDb.updater.addSongToTag(songId, tagName)
        loadTagsMask(songId).then(() => {})
    }
    const deleteTageMask = (songId: string, tagName: string) => {
        tagDb.updater.removeSongFromTag(songId, tagName)
        loadTagsMask(songId).then(() => {})
    }

    useEffect(() => {
        if (!mediaLibraryLoading) {
            loadTags()
            console.log('All tags loaded')
        }
    }, [mediaLibraryLoading])

    useEffect(() => {
        if (!mediaLibraryLoading) {
            const songIdList = getSongIndex()
            loadAllTagsMask(songIdList).then(() => {
                console.log('All tags mask loaded')
                setLoading(false)
            })
        }
    }, [tags])

    return {
        loading,
        tags,
        tagsMasks,
        addTag,
        deleteTag,
        addTagMask,
        deleteTageMask,
    }
}
