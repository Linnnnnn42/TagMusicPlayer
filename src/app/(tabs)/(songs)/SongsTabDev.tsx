import { useEffect, useState } from 'react'
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { songsTabDevStyles } from '@/styles/style'

export default function SongsTabDev() {
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

    return (
        <SafeAreaView style={songsTabDevStyles.container}>
            <View style={songsTabDevStyles.header}>
                <Text style={songsTabDevStyles.title}>Songs @ Music Lib</Text>
                <Button title="Refresh" onPress={loadMusicAssets} disabled={loading} />
                {/*<Button*/}
                {/*    title="GIT"*/}
                {/*    onPress={async () => {*/}
                {/*        return await MediaLibrary.getPermissionsAsync(false, [*/}
                {/*            MediaLibrary.MediaType.audio,*/}
                {/*        ])*/}
                {/*    }}*/}
                {/*    disabled={loading}*/}
                {/*/>*/}
            </View>

            {loading ? (
                <View style={songsTabDevStyles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            ) : (
                <ScrollView style={songsTabDevStyles.listContainer}>
                    {assets.length === 0 ? (
                        <View style={songsTabDevStyles.emptyContainer}>
                            <Text>No files found</Text>
                        </View>
                    ) : (
                        assets.map((asset) => {
                            // console.log(asset)
                            return (
                                <View key={asset.id} style={songsTabDevStyles.assetItem}>
                                    <View style={songsTabDevStyles.assetInfo}>
                                        <Text
                                            style={songsTabDevStyles.assetTitle}
                                            numberOfLines={1}
                                        >
                                            {asset.filename || 'Unknown title'}
                                        </Text>
                                        <Text
                                            style={songsTabDevStyles.assetDetails}
                                            numberOfLines={10}
                                        >
                                            uri: {asset.uri}
                                        </Text>
                                        <Text
                                            style={songsTabDevStyles.assetDetails}
                                            numberOfLines={1}
                                        >
                                            {asset.mediaType} • {Math.round(asset.duration || 0)}{' '}
                                            second
                                        </Text>
                                        <Text
                                            style={songsTabDevStyles.assetDetails}
                                            numberOfLines={1}
                                        >
                                            albumId: {asset.albumId}
                                        </Text>
                                        <Text
                                            style={songsTabDevStyles.assetDetails}
                                            numberOfLines={1}
                                        >
                                            id: {asset.id}
                                        </Text>
                                    </View>
                                    <Text style={songsTabDevStyles.assetDate}>
                                        {new Date(asset.creationTime).toLocaleDateString()}
                                        {' ' +
                                            new Date(asset.modificationTime).toLocaleDateString()}
                                    </Text>
                                </View>
                            )
                        })
                    )}
                </ScrollView>
            )}

            <View style={songsTabDevStyles.footer}>
                <Text>Total {assets.length} songs</Text>
            </View>
        </SafeAreaView>
    )
}
