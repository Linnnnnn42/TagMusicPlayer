import * as MediaLibrary from 'expo-media-library'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import LocalMediaLibrary from '@/utils/getMediaLibrary'

const useGetMediaLibrary = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        granularPermissions: [MediaLibrary.MediaType.audio],
        writeOnly: false,
    })
    const [length, setLength] = useState(0)
    const [loading, setLoading] = useState(true)
    const [musicInfoList, setMusicInfoList] = useState<any[]>([])
    const localMediaLibrary = new LocalMediaLibrary()

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
            const { musicInfoList, length } = await localMediaLibrary.getMediaLib(true)
            console.log('Get MediaLib successful!!!')
            setMusicInfoList(musicInfoList)
            setLength(length)
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
        loadMusicLibrary,
    }
}

export default useGetMediaLibrary
