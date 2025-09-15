import * as MediaLibrary from 'expo-media-library'
import { Asset } from 'expo-media-library'
import { Directory, File } from 'expo-file-system/next'
import { IAudioMetadata, ILyricsTag, IPicture, parseBuffer } from 'music-metadata'
import { uint8ArrayToBase64 } from 'uint8array-extras'
import {
    addOrUpdateSongs,
    addOrUpdateMinimalSongs,
    getAllSongs,
    getAllMinimalSongs,
    getSongCount,
    getMinimalSongCount,
} from '@/database/songStorage'
import { MusicInfo, MinimalMusicInfo } from '@/database/types'

export interface MusicInfoForList {}
export interface MusicInfoForPlayer {}

export default class LocalMediaLibraryMMKV {
    constructor() {}

    private async getAudioAssets() {
        // Get audio assets
        const result = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: 1000, // Limit to first 1000 songs
        })

        return result.assets
    }

    private assetsFilterMusicLibDirString(assets: Asset[]) {
        const musicLibDir = 'file:///storage/emulated/0/Music/'
        const newAssets: Asset[] = []
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i]
            if (asset.uri.substring(0, 33) === musicLibDir) {
                newAssets.push(asset)
            }
        }

        return newAssets
    }

    private async assetsFilterMusicLibDir(assets: Asset[]) {
        const musicLibDir = 'file:///storage/emulated/0/Music/'
        const rootDir = 'file:///storage/emulated/0/'
        const musicLibAlbumIds: (string | undefined)[] = []
        const newAssets: Asset[] = []
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i]
            const file = new File(asset.uri)
            let assetParentDir = file.parentDirectory
            while (assetParentDir.uri !== rootDir) {
                let found = false

                if (musicLibAlbumIds.length > 0) {
                    for (const musicLibAlbumId of musicLibAlbumIds) {
                        if (asset.albumId === musicLibAlbumId) {
                            newAssets.push(asset)
                            found = true
                            break
                        }
                    }
                }

                if (found) {
                    break
                }

                if (assetParentDir.uri === musicLibDir) {
                    musicLibAlbumIds.push(asset.albumId)
                    newAssets.push(asset)
                    break
                }

                assetParentDir = assetParentDir.parentDirectory
            }
        }

        return newAssets
    }

    /**
     * Get metadata by uri
     * @param filePath Uri string
     * @returns Metadata of the file
     */
    private async getMusicMetadata(filePath: string): Promise<IAudioMetadata> {
        try {
            const file = new File(filePath)
            const fileBytes = file.bytes()

            const result = await parseBuffer(fileBytes, {
                size: file.size !== null ? file.size : undefined,
                path: file.name,
            })

            return result
        } catch (error) {
            throw error
        }
    }

    /**
     * Get common metadata by uri
     * @param filePath Uri string
     * @returns Common metadata of the file
     */
    private async getMusicMetadataCommon(filePath: string): Promise<IAudioMetadata['common']> {
        const metadata = await this.getMusicMetadata(filePath)
        return metadata.common
    }

    /**
     * Get native metadata by uri
     * @param filePath Uri string
     * @returns Native metadata of the file
     */
    private async getMusicMetadataNative(filePath: string): Promise<IAudioMetadata['native']> {
        const metadata = await this.getMusicMetadata(filePath)
        return metadata.native
    }

    /**
     * Get format metadata by uri
     * @param filePath Uri string
     * @returns Format metadata of the file
     */
    private async getMusicMetadataFormat(filePath: string): Promise<IAudioMetadata['format']> {
        const metadata = await this.getMusicMetadata(filePath)
        return metadata.format
    }

    private getCoverUriByIPicture(picture: IPicture): string {
        return `data:${picture.format};base64,${uint8ArrayToBase64(picture.data)}`
    }

    private async getMusicInfo(asset: Asset): Promise<MusicInfo> {
        try {
            const filePath = asset.uri
            const file = new File(filePath)
            const metadataCommon = await this.getMusicMetadataCommon(filePath)

            let coverUri: string | undefined
            if (metadataCommon.picture && metadataCommon.picture.length > 0) {
                coverUri = this.getCoverUriByIPicture(metadataCommon.picture[0])
            }

            const { album, artist, artists, title, lyrics, bpm, grouping } = metadataCommon

            const result = {
                album,
                artist,
                artists,
                title,
                lyrics,
                bpm,
                grouping,
                id: asset.id,
                albumId: asset.albumId,
                duration: asset.duration,
                filename: asset.filename,
                modificationTime: asset.modificationTime,
                uri: filePath,
                parentDir: file.parentDirectory,
                cover: coverUri,
            }

            return result
        } catch (error) {
            throw error
        }
    }

    private async getAllMusicInfo(assets: Asset[]): Promise<Promise<MusicInfo>[]> {
        try {
            const startTime = Date.now() // Start timing

            // Parallel processing function with concurrency limit
            const concurrencyLimit = 100 // Maximum number of files processed simultaneously
            const results: (NonNullable<any> | null)[] = new Array(assets.length)

            // Create a function to process tasks
            const processAsset = async (index: number) => {
                const asset = assets[index]
                try {
                    const info = await this.getMusicInfo(asset)
                    return { index, info }
                } catch (error) {
                    console.error(`Error loading info for ${asset.filename}:`, error)
                    return { index, info: null }
                }
            }

            // Process in batches with concurrency limit
            for (let i = 0; i < assets.length; i += concurrencyLimit) {
                const batch = Array.from(
                    { length: Math.min(concurrencyLimit, assets.length - i) },
                    (_, j) => processAsset(i + j),
                )

                const batchResults = await Promise.all(batch)
                batchResults.forEach(({ index, info }) => {
                    results[index] = info
                })
            }

            // Filter out failed items
            const infoArray = results.filter(
                (info): info is NonNullable<typeof info> => info !== null,
            )

            // Log execution time
            const endTime = Date.now()
            console.log(
                `loadMusicInfo executed in ${endTime - startTime} ms with concurrency limit`,
            )

            return infoArray
        } catch (error) {
            throw error
        }
    }

    /**
     * Check if cache is valid
     * @param realtimeAssets Real-time assets
     * @param onlyMusicDir Whether only music directory is being used
     * @returns Whether cache is valid
     */
    private isCacheValid(realtimeAssets: Asset[], onlyMusicDir: boolean): boolean {
        console.log('Validating cache method...')

        // Check if data exists
        const songCount = getSongCount()
        const minimalSongCount = getMinimalSongCount()

        if (songCount === 0 || minimalSongCount === 0) {
            console.log('Cache is empty')
            return false
        }

        // Compare asset count
        if (songCount !== realtimeAssets.length) {
            console.log(
                `Song count mismatch: cache=${songCount}, realtime=${realtimeAssets.length}`,
            )
            return false
        }

        // Check if any assets have been modified by comparing modification times
        const allSongs = getAllMinimalSongs()
        const songMap = new Map(allSongs.map((song) => [song.id, song]))

        for (const realtimeAsset of realtimeAssets) {
            const cachedSong = songMap.get(realtimeAsset.id)
            if (!cachedSong) {
                console.log(`Song not found in cache: ${realtimeAsset.id}`)
                return false
            }

            // Compare modification time
            if (cachedSong.modificationTime !== realtimeAsset.modificationTime) {
                console.log(`Modification time mismatch for ${realtimeAsset.id}`)
                return false
            }
        }

        console.log(`Cache validation passed, ${songCount} songs in total`)
        return true
    }

    async getMediaLib(onlyMusicDir: boolean) {
        try {
            // Get current media library information
            let realtimeAssets = await this.getAudioAssets()

            // If only want music folder, add filter
            if (onlyMusicDir) {
                realtimeAssets = this.assetsFilterMusicLibDirString(realtimeAssets)
            }

            // Check if cache is valid
            const hasData = getSongCount() > 0
            if (hasData && this.isCacheValid(realtimeAssets, onlyMusicDir)) {
                console.log('Using cached music library, Loading...')

                const musicInfoList = getAllSongs()
                const minimalMusicInfoList = getAllMinimalSongs()

                // Verify data integrity
                if (!musicInfoList || !minimalMusicInfoList || musicInfoList.length === 0) {
                    console.log('Cached data structure invalid')
                    // Fall back to re-fetching
                } else {
                    return {
                        musicInfoList,
                        minimalMusicInfoList,
                        length: realtimeAssets.length,
                    }
                }
            }

            console.log('Cache outdated or missing, updating...')

            // Cache does not exist or expired, re-fetch music information
            const musicInfoListPromises = await this.getAllMusicInfo(realtimeAssets)
            const musicInfoList = await Promise.all(musicInfoListPromises)

            // Create minimal info list
            const minimalMusicInfoList = this.createMinimalMusicInfoList(musicInfoList)

            // Store data
            console.log('Storing music library...')
            addOrUpdateSongs(musicInfoList)
            addOrUpdateMinimalSongs(minimalMusicInfoList)

            console.log('Music library cache updated')

            return {
                musicInfoList,
                minimalMusicInfoList,
                length: realtimeAssets.length,
            }
        } catch (error) {
            console.error('Error in getMediaLib:', error)
            throw error
        }
    }

    // Helper function to create minimal music info list with title fallback
    private createMinimalMusicInfoList(musicInfoList: MusicInfo[]): MinimalMusicInfo[] {
        return musicInfoList.map((item: MusicInfo) => ({
            id: item.id,
            title: item.title && item.title.trim() !== '' ? item.title : item.filename,
            artist: item.artist && item.artist.trim() !== '' ? item.artist : '佚名',
            cover: item.cover,
            lyrics: item.lyrics,
            allLyricsLines: this.concatAllLyricsLines(item.lyrics?.[0]),
            filename: item.filename,
            uri: item.uri,
            modificationTime: item.modificationTime,
        }))
    }

    private concatAllLyricsLines(lyrics: ILyricsTag | undefined) {
        if (lyrics === undefined) {
            return undefined // Lyrics Not Found
        } else {
            if (lyrics.text) {
                if ([0, 1, 2, 3, 4, 5].includes(lyrics.text.length)) {
                    return 'Instrumental - 纯音乐'
                } else {
                    return lyrics.text
                }
            } else {
                if ([0, 1, 2, 3, 4, 5].includes(lyrics.syncText.length)) {
                    return 'Instrumental - 纯音乐'
                } else {
                    const result = lyrics.syncText.map((item) => item.text).join(' ')
                    return result
                }
            }
        }
    }

    async checkMediaLibraryAvailability() {
        const result = await MediaLibrary.isAvailableAsync()
        console.log('MediaLibrary is available:', result)
    }
}
