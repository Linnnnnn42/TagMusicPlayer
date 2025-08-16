import * as MediaLibrary from 'expo-media-library'
import { Directory, File, Paths } from 'expo-file-system/next'
import { IAudioMetadata, ILyricsTag, IPicture, parseBuffer } from 'music-metadata'
import { uint8ArrayToBase64 } from 'uint8array-extras'
import { Asset } from 'expo-media-library'

interface CachedMusicInfo {
    musicInfoList: MusicInfo[]
    timestamp: number
}

interface CachedAssetsInfo {
    assets: Asset[]
    cachedOnlyMusicDir: boolean
    timestamp: number
}

const hash = require('object-hash')

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

export default class LocalMediaLibrary {
    constructor() {}

    private async getAudioAssets() {
        // Get audio assets
        const result = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: 1000, // Limit to first 100 songs
        })

        // const filteredAssets = this.assetsFilterMusicLibDirString(result.assets)

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
                // mimeType: 'audio',
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

    async getMediaLib(onlyMusicDir: boolean) {
        const cacheFile = new File(Paths.cache, 'musicInfo.json')
        const cacheAssetsFile = new File(Paths.cache, 'musicAssets.json')

        try {
            // Get current media library information
            let realtimeAssets = await this.getAudioAssets()

            // If only want music folder, add filter
            if (onlyMusicDir) {
                realtimeAssets = this.assetsFilterMusicLibDirString(realtimeAssets)
            }

            if (cacheFile.exists && cacheAssetsFile.exists) {
                try {
                    // Read cached assets file
                    const cachedAssetsData = JSON.parse(cacheAssetsFile.text()) // 2-5 ms

                    let { assets: cachedAssets, cachedOnlyMusicDir, timestamp } = cachedAssetsData

                    // If only want music folder, add filter
                    if (onlyMusicDir) {
                        cachedAssets = this.assetsFilterMusicLibDirString(cachedAssets)
                    }

                    if (cachedOnlyMusicDir !== onlyMusicDir) {
                        // Setting changed, update cache
                        console.log('onlyMusicDir setting changed')
                    } else {
                        // Check if cache is valid (compare asset count and modification time)
                        if (this.isCacheValid(cachedAssets, realtimeAssets, false)) {
                            console.log('Using cached music library, Loading...')
                            // Use type assertion to ensure parsed data type is correct
                            const cachedData = JSON.parse(cacheFile.text()) as CachedMusicInfo

                            // Verify data structure integrity
                            if (!cachedData || !cachedData.musicInfoList) {
                                console.log('Cached data structure invalid')
                                return undefined
                            }

                            // Create minimal info list and ensure correct type
                            const minimalMusicInfoList = this.createMinimalMusicInfoList(
                                cachedData.musicInfoList,
                            )

                            // Return explicitly typed response
                            return {
                                musicInfoList: cachedData.musicInfoList as MusicInfo[],
                                minimalMusicInfoList: minimalMusicInfoList,
                                length: realtimeAssets.length,
                            }
                        }
                    }
                } catch (parseError) {
                    console.log('Failed to parse cache, updating...', parseError)
                }
            }

            if (cacheFile.exists && cacheAssetsFile.exists) {
                // Cache outdated
                console.log('Cache outdated, updating...')
            } else {
                // Cache does not exist
                console.log('Init cache, updating...')
            }

            // Cache does not exist or expired, re-fetch music information
            const musicInfoListPromises = await this.getAllMusicInfo(realtimeAssets)
            const musicInfoList = await Promise.all(musicInfoListPromises)
            const timestamp = Date.now()

            const cacheData: CachedMusicInfo = {
                musicInfoList: musicInfoList,
                timestamp: timestamp,
            }

            const cacheAssetsData: CachedAssetsInfo = {
                assets: realtimeAssets,
                cachedOnlyMusicDir: onlyMusicDir,
                timestamp: timestamp,
            }

            // Write cache files
            if (!cacheFile.exists) {
                cacheFile.create()
            }
            if (!cacheAssetsFile.exists) {
                cacheAssetsFile.create()
            }

            cacheFile.write(JSON.stringify(cacheData, null, 4))
            cacheAssetsFile.write(JSON.stringify(cacheAssetsData, null, 4))

            const minimalMusicInfoList = this.createMinimalMusicInfoList(musicInfoList)

            console.log('Music library cache updated')

            return {
                musicInfoList,
                minimalMusicInfoList: minimalMusicInfoList,
                length: realtimeAssets.length,
            }
        } catch (error) {
            console.error('Error in getMediaLib:', error)
            throw error
        }
    }

    /**
     * Check if cache is valid
     * @param cachedAssets Cached assets
     * @param realtimeAssets Real-time assets
     * @param useHash Whether to use hash for validation
     * @returns Whether cache is valid
     */
    private isCacheValid(cachedAssets: any[], realtimeAssets: Asset[], useHash: boolean): boolean {
        console.log('Validating...')
        if (useHash) {
            console.log('Use hash')
            return hash(cachedAssets) === hash(realtimeAssets)
        } else {
            // Simple comparison of asset count
            if (cachedAssets.length !== realtimeAssets.length) {
                return false
            }

            // Check asset modification time
            for (let i = 0; i < realtimeAssets.length; i++) {
                const cachedAsset = cachedAssets[i]
                const realtimeAsset = realtimeAssets[i]

                // Compare ID and modification time
                if (
                    cachedAsset.id !== realtimeAsset.id ||
                    cachedAsset.modificationTime !== realtimeAsset.modificationTime
                ) {
                    return false
                }
            }

            return true
        }
    }

    // Helper function to create minimal music info list with title fallback
    private createMinimalMusicInfoList(musicInfoList: MusicInfo[]) {
        return musicInfoList.map((item: MusicInfo) => ({
            id: item.id,
            title: item.title && item.title.trim() !== '' ? item.title : item.filename,
            filename: item.filename,
            artist: item.artist,
            cover: item.cover,
            lyrics: item.lyrics,
            allLyricsLines: this.concatAllLyricsLines(item.lyrics?.[0]),
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
