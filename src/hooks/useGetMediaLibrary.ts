import * as MediaLibrary from 'expo-media-library'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import LocalMediaLibraryMMKV from '@/utils/getMediaLibraryMMKV'
import { MusicInfo, MinimalMusicInfo } from '@/database/types'

const useGetMediaLibrary = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        granularPermissions: [MediaLibrary.MediaType.audio],
        writeOnly: false,
    })
    const [length, setLength] = useState(0)
    const [loading, setLoading] = useState(true)
    const [musicInfoList, setMusicInfoList] = useState<MusicInfo[]>([])
    const [minimalMusicInfoList, setMinimalMusicInfoList] = useState<MinimalMusicInfo[]>([])
    const localMediaLibrary = new LocalMediaLibraryMMKV()

    useEffect(() => {
        localMediaLibrary.checkMediaLibraryAvailability().then((r) => {})
    }, [])

    const loadMusicLibrary = async () => {
        setLoading(true)

        try {
            // Check for audio permission
            if (permissionResponse?.status !== 'granted') {
                const { status } = await requestPermission()
                if (status !== 'granted') {
                    Alert.alert('ERROR', 'Permission denied')
                    return
                }
            }

            // Load media library using cache
            const result = await localMediaLibrary.getMediaLib(true)
            if (result) {
                const { musicInfoList, minimalMusicInfoList, length } = result
                console.log('Get MediaLib successful!!!')
                setMusicInfoList(musicInfoList)
                setLength(length)
                setMinimalMusicInfoList(minimalMusicInfoList)
            } else {
                console.log('Failed to get MediaLib')
                Alert.alert('ERROR', 'Failed to load music library')
            }
        } catch (error) {
            console.error('Failed to load music library:', error)
            Alert.alert('ERROR', 'Failed to load music library')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMusicLibrary()
    }, [])

    return {
        loading,
        length,
        musicInfoList,
        minimalMusicInfoList,
        loadMusicLibrary,
    }
}

export default useGetMediaLibrary
