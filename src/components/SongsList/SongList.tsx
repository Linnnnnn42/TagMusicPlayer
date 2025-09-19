import { FlatList, Text, View } from 'react-native'
import { songListStyles } from '@/styles/style'
import { fontSize } from '@/constants/tokens'
import { t } from 'i18next'
import { i18nTokens } from '@/i18n/i18nTokens'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Divider } from 'react-native-paper'
import { SongsListItem, SongsListItemProps } from '@/components/SongsList/SongsListItem'
import { JSX, useCallback } from 'react'

type SongListProps = {
    filteredMusicInfoList?: SongsListItemProps['song'][]
    songIdPlaying?: string | undefined
    onSongChange?: ((songId: string) => void) | undefined
    customizedContentContainerStyle?: {}
    customizedStyle?: {}
}

export const SongList = ({
    filteredMusicInfoList,
    songIdPlaying,
    onSongChange,
    customizedContentContainerStyle,
    customizedStyle,
}: SongListProps) => {
    const renderItem = useCallback(
        ({ item: song }: { item: SongsListItemProps['song'] }) => (
            <SongsListItem song={song} songIdPlaying={songIdPlaying} onSongChange={onSongChange} />
        ),
        [onSongChange, songIdPlaying],
    )

    return (
        <FlatList
            data={filteredMusicInfoList}
            renderItem={renderItem}
            keyExtractor={(song) => song.id}
            contentContainerStyle={
                customizedContentContainerStyle ? customizedContentContainerStyle : null
            }
            style={customizedStyle ? customizedStyle : null}
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
    )
}
