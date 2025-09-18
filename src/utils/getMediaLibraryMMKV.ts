import * as MediaLibrary from 'expo-media-library'
import { Asset } from 'expo-media-library'
import { Directory, File } from 'expo-file-system/next'
import { IAudioMetadata, ILyricsTag, IPicture, parseBuffer } from 'music-metadata'
import { uint8ArrayToBase64 } from 'uint8array-extras'
import { songCreator, songReader, songDeleter } from '@/database/songStorage'
import { MusicInfo, MinimalMusicInfo } from '@/database/types'
import * as tagDb from '@/database/songTagLinkedWrapper'
import { hasLaunched } from '@/database/envStorage'

interface IncrementalUpdateDiff {
    newSongs: Asset[]
    modifiedSongs: Asset[]
    deletedSongs: MinimalMusicInfo[]
}

interface IncrementalUpdateStats {
    totalSongs: number
    newSongs: number
    modifiedSongs: number
    deletedSongs: number
    updateTime: number
}

export default class LocalMediaLibraryMMKV {
    // Cache for storing song data to reduce redundant database calls
    private allSongsCache: MusicInfo[] | null = null
    private allSongsCacheMap: Map<string, MusicInfo> | null = null
    private allMinimalSongsCache: MinimalMusicInfo[] | null = null
    private allMinimalSongsCacheMap: Map<string, MinimalMusicInfo> | null = null

    constructor() {}

    /**
     * Clear internal caches
     */
    private clearCache(): void {
        this.allSongsCache = null
        this.allMinimalSongsCache = null
    }

    /**
     * Get all songs cached
     */
    private getAllSongsCached(): MusicInfo[] {
        if (this.allSongsCache === null) {
            this.allSongsCache = songReader.getAllSongs()
        }
        return this.allSongsCache
    }

    /**
     * Get all songs cached in map form
     */
    private getAllSongsMapCached(): Map<string, MusicInfo> {
        if (this.allSongsCacheMap === null) {
            this.allSongsCacheMap = new Map(this.getAllSongsCached().map((song) => [song.id, song]))
        }
        return this.allSongsCacheMap
    }

    /**
     * Get all minimal cached
     */
    private getAllMinimalSongsCached(): MinimalMusicInfo[] {
        if (this.allMinimalSongsCache === null) {
            this.allMinimalSongsCache = songReader.getAllMinimalSongs()
        }
        return this.allMinimalSongsCache
    }

    /**
     * Get all songs cached in map form
     */
    private getAllMinimalSongsMapCached(): Map<string, MinimalMusicInfo> {
        if (this.allMinimalSongsCacheMap === null) {
            this.allMinimalSongsCacheMap = new Map(
                this.getAllMinimalSongsCached().map((song) => [song.id, song]),
            )
        }
        return this.allMinimalSongsCacheMap
    }

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

    private async getAllMusicInfo(assets: Asset[]): Promise<MusicInfo[]> {
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
     * @returns Whether cache is valid
     */
    private isCacheValid(realtimeAssets: Asset[]): boolean {
        console.log('Validating cache method...')

        // Check if data exists
        const songCount = songReader.getSongCount()
        const minimalSongCount = songReader.getMinimalSongCount()

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
        const songMap = this.getAllMinimalSongsMapCached()

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

    /**
     * Get incremental update differences between cache and realtime assets
     * @param realtimeAssets Current media library assets
     * @returns Incremental update differences
     */
    private getIncrementalDiff(realtimeAssets: Asset[]): IncrementalUpdateDiff {
        console.log('Analyzing incremental update differences...')

        const cachedSongs = this.getAllMinimalSongsCached()
        const cachedSongMap = this.getAllMinimalSongsMapCached()
        const realtimeAssetMap = new Map(realtimeAssets.map((asset) => [asset.id, asset]))

        const newSongs: Asset[] = []
        const modifiedSongs: Asset[] = []
        const deletedSongs: MinimalMusicInfo[] = []

        // Find new and modified songs
        for (const realtimeAsset of realtimeAssets) {
            const cachedSong = cachedSongMap.get(realtimeAsset.id)

            if (!cachedSong) {
                // New song
                newSongs.push(realtimeAsset)
                console.log(`New song found: ${realtimeAsset.filename}`)
            } else if (cachedSong.modificationTime !== realtimeAsset.modificationTime) {
                // Modified song
                modifiedSongs.push(realtimeAsset)
                console.log(`Modified song found: ${realtimeAsset.filename}`)
            }
        }

        // Find deleted songs
        for (const cachedSong of cachedSongs) {
            if (!realtimeAssetMap.has(cachedSong.id)) {
                deletedSongs.push(cachedSong)
                console.log(`Deleted song found: ${cachedSong.filename}`)
            }
        }

        const stats = {
            newSongs: newSongs.length,
            modifiedSongs: modifiedSongs.length,
            deletedSongs: deletedSongs.length,
            totalSongs: realtimeAssets.length,
        }

        console.log(
            `Incremental update analysis complete: ${stats.newSongs} new, ${stats.modifiedSongs} modified, ${stats.deletedSongs} deleted`,
        )

        return { newSongs, modifiedSongs, deletedSongs }
    }

    /**
     * Process incremental updates
     * @param diff Incremental update differences
     * @returns Updated music info lists
     */
    private async processIncrementalUpdates(diff: IncrementalUpdateDiff): Promise<{
        updatedMusicInfoList: MusicInfo[]
        updatedMinimalMusicInfoList: MinimalMusicInfo[]
    }> {
        console.log('Processing incremental updates...')

        const { newSongs, modifiedSongs, deletedSongs } = diff

        // Get current mapped cache
        const musicInfoMap = this.getAllSongsMapCached()
        const minimalMusicInfoMap = this.getAllMinimalSongsMapCached()

        // Remove deleted songs
        for (const deletedSong of deletedSongs) {
            musicInfoMap.delete(deletedSong.id)
            minimalMusicInfoMap.delete(deletedSong.id)
            songDeleter.deleteSong(deletedSong.id)
            songDeleter.deleteMinimalSong(deletedSong.id)
            tagDb.deleter.deleteSongTag(deletedSong.id)
            console.log(`Removed deleted song: ${deletedSong.filename}`)
        }

        // Process new and modified songs
        const songsToProcess = [...newSongs, ...modifiedSongs]
        if (songsToProcess.length > 0) {
            console.log(`Processing ${songsToProcess.length} new/modified songs...`)

            // Get metadata for new/modified songs
            const newMusicInfoList = await this.getAllMusicInfo(songsToProcess)
            const newMinimalMusicInfoList = this.createMinimalMusicInfoList(newMusicInfoList)

            // Update maps with new/modified songs
            for (const musicInfo of newMusicInfoList) {
                musicInfoMap.set(musicInfo.id, musicInfo)
                tagDb.creator.initSongTag(musicInfo.id)
            }
            for (const minimalMusicInfo of newMinimalMusicInfoList) {
                minimalMusicInfoMap.set(minimalMusicInfo.id, minimalMusicInfo)
            }

            // Store updates in batch
            songCreator.addOrUpdateSongs(newMusicInfoList)
            songCreator.addOrUpdateMinimalSongs(newMinimalMusicInfoList)
        }

        // Convert maps back to arrays
        const updatedMusicInfoList = Array.from(musicInfoMap.values())
        const updatedMinimalMusicInfoList = Array.from(minimalMusicInfoMap.values())

        // Clear cache since data has been updated
        this.clearCache()

        console.log(`Incremental update complete: ${updatedMusicInfoList.length} total songs`)

        return { updatedMusicInfoList, updatedMinimalMusicInfoList }
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
            const hasData = songReader.getSongCount() > 0
            if (hasData) {
                if (this.isCacheValid(realtimeAssets)) {
                    console.log('Using cached music library, Loading...')

                    const musicInfoList = this.getAllSongsCached()
                    const minimalMusicInfoList = this.getAllMinimalSongsCached()

                    // Verify data integrity
                    if (!musicInfoList || !minimalMusicInfoList || musicInfoList.length === 0) {
                        console.log('Cached data structure invalid')
                        // Fall back to re-fetching - continue to next block
                    } else {
                        return {
                            musicInfoList,
                            minimalMusicInfoList,
                            length: realtimeAssets.length,
                        }
                    }
                }
            }

            // Try incremental update if cache exists but is not valid
            if (hasData) {
                console.log('Cache invalid, attempting incremental update...')
                try {
                    const diff = this.getIncrementalDiff(realtimeAssets)
                    const totalChanges =
                        diff.newSongs.length + diff.modifiedSongs.length + diff.deletedSongs.length

                    // Only use incremental update if changes are relatively small
                    // const changeRatio = totalChanges / realtimeAssets.length
                    // if (changeRatio < 0.5) {
                    if (!hasLaunched()) {
                        const { updatedMusicInfoList, updatedMinimalMusicInfoList } =
                            await this.processIncrementalUpdates(diff)

                        // Update statistics
                        console.log('Updating incremental update statistics...')
                        const stats: IncrementalUpdateStats = {
                            totalSongs: updatedMusicInfoList.length,
                            newSongs: diff.newSongs.length,
                            modifiedSongs: diff.modifiedSongs.length,
                            deletedSongs: diff.deletedSongs.length,
                            updateTime: Date.now(),
                        }
                        console.log('Incremental update stats:', stats)
                        console.log(
                            `Incremental update successful: ${totalChanges} changes processed`,
                        )

                        return {
                            musicInfoList: updatedMusicInfoList,
                            minimalMusicInfoList: updatedMinimalMusicInfoList,
                            length: realtimeAssets.length,
                        }
                    } else {
                        console.log('First time to launch, falling back to full update')
                    }
                    // } else {
                    //     console.log(
                    //         `Too many changes (${(changeRatio * 100).toFixed(1)}%), falling back to full update`,
                    //     )
                    // }
                } catch (error) {
                    console.error('Incremental update failed, falling back to full update:', error)
                }
            }

            console.log('Performing full cache update...')

            // Cache does not exist or incremental update failed, re-fetch music information
            const musicInfoList = await this.getAllMusicInfo(realtimeAssets)

            // Create minimal info list
            const minimalMusicInfoList = this.createMinimalMusicInfoList(musicInfoList)

            // Init tags management
            minimalMusicInfoList.forEach((minimalMusicInfo) => {
                tagDb.creator.initSongTag(minimalMusicInfo.id)
            })

            // Store data
            console.log('Storing music library...')
            songCreator.addOrUpdateSongs(musicInfoList)
            songCreator.addOrUpdateMinimalSongs(minimalMusicInfoList)

            console.log('Music library cache updated')

            // Clear cache since data has been updated
            this.clearCache()

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
