import { IAudioMetadata, ILyricsTag } from 'music-metadata'
import { Directory } from 'expo-file-system/next'

// Type definitions for MusicInfo and MinimalMusicInfo
export type MusicInfo = Pick<
    IAudioMetadata['common'],
    'album' | 'artist' | 'artists' | 'title' | 'lyrics' | 'bpm' | 'grouping'
> & {
    id: string
    albumId: string | undefined
    duration: number
    filename: string
    modificationTime: number
    uri: string
    parentDir: Directory
    cover: string | undefined
}

export interface MinimalMusicInfo {
    id: string
    title: string
    artist: string | undefined
    cover: string | undefined
    lyrics: ILyricsTag[] | undefined
    allLyricsLines: string | undefined
    filename: string
    uri: string
    modificationTime: number
}
