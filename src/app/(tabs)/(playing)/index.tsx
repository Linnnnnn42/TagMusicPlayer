import { FlatList, View } from 'react-native'
import defaultStyle from '@/styles/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/tokens'
import TabHeader from '@/components/TabHeader'
import React, { useContext } from 'react'
import { i18nTokens } from '@/i18n/i18nTokens'
import { musicPlayerContext, tagContext, tagFilterContext } from '@/app/_layout'
import { SongList } from '@/components/SongsList/SongList'
import { TagFilterButton } from '@/components/PlayingTab/TagFilterButton'
import { TagFilterState } from '@/hooks/playingTab/useTagFilter'

export default function PlayingTab() {
    // Tag filtering
    const tagFilter = useContext(tagFilterContext)
    const tagStates = tagFilter?.tagStates || {}
    const filteredSongs = tagFilter?.filteredSongs || []
    const updateTagState = tagFilter?.updateTagState

    // Load tags
    const tagCtx = useContext(tagContext)
    const tags = tagCtx?.tags || []

    const renderTagItem = ({ item }: { item: string }) => (
        <View style={{ marginHorizontal: 3, marginVertical: 3 }}>
            <TagFilterButton
                tag={item}
                initialState={tagStates[item] || 'neutral'}
                onPress={(state: TagFilterState) => {
                    updateTagState?.(item, state)
                }}
            />
        </View>
    )

    // States for song list
    const musicPlayer = useContext(musicPlayerContext)
    if (!musicPlayer) {
        throw new Error('useContext Fail')
    }
    const { songIdPlaying, handleSongChange } = musicPlayer

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
                    <SongList
                        filteredMusicInfoList={filteredSongs}
                        onSongChange={handleSongChange}
                        songIdPlaying={songIdPlaying}
                        customizedStyle={{
                            marginBottom: 110,
                        }}
                    />
                    <View
                        style={{
                            bottom: 100,
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
