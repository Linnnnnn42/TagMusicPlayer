import { Alert, Button, FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { useEffect, useState } from 'react'
import defaultStyle, { songsTabDevStyles } from '@/styles/style'

export const SongsList = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        granularPermissions: [MediaLibrary.MediaType.audio],
        writeOnly: false,
    })
    const [assets, setAssets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const checkMediaLibraryAvailability = async () => {
        const result = await MediaLibrary.isAvailableAsync()
        console.log('MediaLibrary is available:', result)
    }

    useEffect(() => {
        checkMediaLibraryAvailability()
    }, [])

    const loadMusicAssets = async () => {
        setLoading(true)
        try {
            // Check for audio permission
            if (permissionResponse?.status !== 'granted') {
                const { status } = await requestPermission()
                // console.log(status)
                if (status !== 'granted') {
                    Alert.alert('ERROR', 'Permission denied')
                    setLoading(false)
                    return
                }
            }

            // Get audio assets
            const result = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',
                first: 100, // Limit to first 100 songs
            })
            // console.log(!!result)

            setAssets(result.assets)
        } catch (error) {
            console.error('Failed to fetch music files:', error)
            Alert.alert('ERROR', 'Failed to fetch music files')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Automatically load music files when component mounts
        loadMusicAssets()
    }, [])

    // console.log(assets)

    return loading ? (
        <View style={songsTabDevStyles.loadingContainer}>
            <Text>Loading...</Text>
        </View>
    ) : assets.length === 0 ? (
        <View style={songsTabDevStyles.emptyContainer}>
            <Text>No files found</Text>
        </View>
    ) : (
        <FlatList
            data={assets}
            renderItem={({ item }) => <Text style={defaultStyle.text}>{item.filename}</Text>}
            keyExtractor={(item) => item.id}
        />
    )
}
