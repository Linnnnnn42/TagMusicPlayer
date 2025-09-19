import { useCallback, useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { SongsListItem, SongsListItemProps } from '@/components/SongsList/SongsListItem'
import { fontSize } from '@/constants/tokens'
import { songListStyles } from '@/styles/style'
import { SongList } from '@/components/SongsList/SongList'

type SongsListForSongTabProps = {
    loading: boolean
    filteredMusicInfoList: SongsListItemProps['song'][]
    visible?: boolean
    songIdPlaying?: string
    onSongChange?: (song: string) => void
}

export const SongsListForSongTab = ({
    loading,
    filteredMusicInfoList,
    visible = true,
    songIdPlaying,
    onSongChange,
}: SongsListForSongTabProps) => {
    const animation = useRef(new Animated.Value(visible ? 1 : 0)).current

    useEffect(() => {
        Animated.timing(animation, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true, // Use native driver
        }).start()
    }, [visible])

    // translateY => Use native driver
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 130],
    })

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={songListStyles.loadingContainer}>
                    <Text style={{ fontSize: fontSize.medium }}>Loading...</Text>
                </View>
            ) : (
                <View style={{ flex: 1, overflow: 'hidden' }}>
                    <Animated.View
                        style={{
                            transform: [{ translateY }],
                            flex: 1,
                        }}
                    >
                        <SongList
                            filteredMusicInfoList={filteredMusicInfoList}
                            onSongChange={onSongChange}
                            songIdPlaying={songIdPlaying}
                            customizedContentContainerStyle={{
                                paddingBottom: 160,
                            }}
                        />
                    </Animated.View>
                </View>
            )}
        </View>
    )
}
