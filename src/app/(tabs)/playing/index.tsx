import { FlatList, Text, View } from 'react-native'
import defaultStyle, { songListStyles } from '@/styles/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontSize } from '@/constants/tokens'
import TabHeader from '@/components/TabHeader'
import React, { useCallback, useContext } from 'react'
import { i18nTokens } from '@/i18n/i18nTokens'
import { Chip, Divider } from 'react-native-paper'
import { mediaLibraryContext, musicPlayerContext, tagContext } from '@/app/_layout'
import { SongsListItem, SongsListItemProps } from '@/components/SongsTab/SongsListItem'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useTagFilter } from '@/hooks/playingTab/useTagFilter'
import { t } from 'i18next'

export default function PlaylistsTab() {
    // Get Lib Data
    const mediaLibrary = useContext(mediaLibraryContext)
    const { minimalMusicInfoList } = { ...mediaLibrary }

    // Tag filtering
    const { selectedTags, filteredSongs, toggleTagSelection } = useTagFilter({
        minimalMusicInfoList,
    })

    // Load tags
    const tagManagement = useContext(tagContext)
    if (!tagManagement) {
        throw new Error('Tag context is not available')
    }
    const { tags } = tagManagement

    const renderTagItem = ({ item }: { item: string }) => (
        <View style={{ marginHorizontal: 3, marginVertical: 3 }}>
            <Chip
                compact={true}
                mode={'outlined'}
                selected={selectedTags.has(item)}
                showSelectedCheck={false}
                showSelectedOverlay={true}
                onPress={() => {
                    toggleTagSelection(item)
                }}
            >
                {item}
            </Chip>
        </View>
    )

    // For song list
    const musicPlayer = useContext(musicPlayerContext)
    if (!musicPlayer) {
        throw new Error('useContext Fail')
    }
    const { songIdPlaying, handleSongChange } = musicPlayer
    const renderItem = useCallback(
        ({ item: song }: { item: SongsListItemProps['song'] }) => (
            <SongsListItem
                song={song}
                songIdPlaying={songIdPlaying}
                onSongChange={handleSongChange}
            />
        ),
        [handleSongChange, songIdPlaying],
    )

    return (
        <View style={{ backgroundColor: colors.background, height: '100%' }}>
            <SafeAreaView
                style={{
                    ...defaultStyle.container,
                    backgroundColor: colors.primaryOpacity30,
                    height: 'auto',
                }}
            >
                <TabHeader // height: '14%'
                    tabTitle={i18nTokens.tabs.playing}
                    iconName={'playlists'}
                    rotate={'-15deg'}
                    translateY={-35}
                    translateX={-30}
                />
                <View style={{ backgroundColor: '#fff', height: '86%' }}>
                    {/*Tags selection part*/}
                    <FlatList
                        style={{
                            marginBottom: 100,
                        }}
                        data={filteredSongs}
                        renderItem={renderItem}
                        keyExtractor={(song) => song.id}
                        ListEmptyComponent={
                            <View style={songListStyles.emptyContainer}>
                                <Text style={{ fontSize: fontSize.medium }}>
                                    {t(i18nTokens.tabs.general.noSongsFound)}
                                </Text>
                                <MaterialIcons
                                    name="art-track"
                                    size={130}
                                    style={{
                                        ...songListStyles.songEmptyCoverImage,
                                    }}
                                />
                            </View>
                        }
                        ItemSeparatorComponent={Divider}
                    />
                    <View
                        style={{
                            bottom: 90,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <FlatList
                            data={tags}
                            renderItem={renderTagItem}
                            keyExtractor={(item) => item}
                            numColumns={3}
                            columnWrapperStyle={{ justifyContent: 'center' }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}
