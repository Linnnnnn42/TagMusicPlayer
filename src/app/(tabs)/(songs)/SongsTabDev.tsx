import { useEffect, useState } from 'react'
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { songsTabStyles } from '@/styles/style'
import { getMusicMetadataCommon } from '@/utils/getMediaLibrary'
import { File } from 'expo-file-system/next'

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
        // const metadata = await getMusicMetadataCommon(
        //     'file:///storage/emulated/0/Music/QQMusic/wlf158 - 魔幻手机主题曲《穿越》 (纯音乐) [qmms].ogg',
        // ).catch((error) => {
        //     console.error(error)
        // })
        // console.log(metadata)

        // const file = new File(
        //     'file:///storage/emulated/0/Music/QQMusic/wlf158 - 魔幻手机主题曲《穿越》 (纯音乐) [qmms].ogg',
        // )
        // console.log(file)
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
        <SafeAreaView style={songsTabStyles.container}>
            <View style={songsTabStyles.header}>
                <Text style={songsTabStyles.title}>Songs @ Music Lib</Text>
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
                <View style={songsTabStyles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            ) : (
                <ScrollView style={songsTabStyles.listContainer}>
                    {assets.length === 0 ? (
                        <View style={songsTabStyles.emptyContainer}>
                            <Text>No files found</Text>
                        </View>
                    ) : (
                        assets.map((asset) => {
                            // console.log(asset) //!!!!!!!!
                            return (
                                <View key={asset.id} style={songsTabStyles.assetItem}>
                                    <View style={songsTabStyles.assetInfo}>
                                        <Text style={songsTabStyles.assetTitle} numberOfLines={1}>
                                            {asset.filename || 'Unknown title'}
                                        </Text>
                                        <Text
                                            style={songsTabStyles.assetDetails}
                                            numberOfLines={10}
                                        >
                                            uri: {asset.uri}
                                        </Text>
                                        <Text style={songsTabStyles.assetDetails} numberOfLines={1}>
                                            {asset.mediaType} • {Math.round(asset.duration || 0)}{' '}
                                            second
                                        </Text>
                                        <Text style={songsTabStyles.assetDetails} numberOfLines={1}>
                                            albumId: {asset.albumId}
                                        </Text>
                                        <Text style={songsTabStyles.assetDetails} numberOfLines={1}>
                                            id: {asset.id}
                                        </Text>
                                    </View>
                                    <Text style={songsTabStyles.assetDate}>
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

            <View style={songsTabStyles.footer}>
                <Text>Total {assets.length} songs</Text>
            </View>
        </SafeAreaView>
    )
}
