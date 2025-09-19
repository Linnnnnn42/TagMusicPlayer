import React, { useCallback, useRef, useMemo, useEffect, useState, useContext } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import BottomSheet, {
    BottomSheetFlatList,
    BottomSheetView,
    useBottomSheetSpringConfigs,
    useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet'
import { BackHandler } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, fontWeight } from '@/constants/tokens'
import { PlayerProps } from '@/app/(tabs)/_layout'
import { Image } from 'expo-image'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import TextTicker from 'react-native-text-ticker'
import { useTranslation } from 'react-i18next'
import { Slider as SliderAwesome } from 'react-native-awesome-slider'
import { useSharedValue } from 'react-native-reanimated'
import { FontAwesome6 } from '@expo/vector-icons'
import { i18nTokens } from '@/i18n/i18nTokens'
import { Chip } from 'react-native-paper'
import { tagContext } from '@/app/_layout'
import { playPauseButtonHandler } from '@/handler/playerHandler'

export type PlayerHandle = {
    openPlayer: () => void
    closePlayer: () => void
}

type BottomPlayerProps = PlayerProps & {
    ref?: React.Ref<PlayerHandle>
    previousSongId: string
    nextSongId: string
    handleSongChange: (songId: string) => void
}

const Player = ({
    ref,
    player,
    playerStatus,
    backgroundColor,
    titleTextColor,
    lyricsTextColor,
    songInfo,
    currentLyric,
    previousSongId,
    nextSongId,
    handleSongChange,
}: BottomPlayerProps) => {
    const { t } = useTranslation()

    // For bottom sheet:
    // Bottom sheet hooks
    const sheetRef = useRef<BottomSheet>(null)
    const currentIndexRef = useRef<number>(-1)
    // Bottom sheet variables
    const snapPoints = useMemo(() => ['100%'], [])
    const { top } = useSafeAreaInsets()
    // Bottom sheet animation configs
    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
    })
    // Bottom sheet callbacks
    const handleSheetChange = useCallback((index: number) => {
        currentIndexRef.current = index
    }, [])
    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index)
    }, [])
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close()
    }, [])
    // Handle hardware back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (currentIndexRef.current > -1) {
                handleClosePress()
                return true
            }
            return false
        })

        return () => backHandler.remove()
    }, [handleClosePress])
    // Expose methods to parent components
    useEffect(() => {
        if (ref) {
            if (typeof ref === 'function') {
                ref({
                    openPlayer: () => handleSnapPress(0),
                    closePlayer: () => handleClosePress(),
                })
            } else if (ref.hasOwnProperty('current')) {
                ;(ref as React.RefObject<PlayerHandle>).current = {
                    openPlayer: () => handleSnapPress(0),
                    closePlayer: () => handleClosePress(),
                }
            }
        }
    }, [ref, handleSnapPress, handleClosePress])

    // For slider
    const progress = useSharedValue(0)
    const min = useSharedValue(0)
    const max = useSharedValue(1)
    const [isProgressMoving, setIsProgressMoving] = useState(true)
    // For seek state to prevent button flickering
    const [isSeeking, setIsSeeking] = useState(false)
    const [lastPlayPauseState, setLastPlayPauseState] = useState('')
    useEffect(() => {
        if (isProgressMoving) {
            if (playerStatus && playerStatus.duration && playerStatus.duration > 0) {
                progress.value = (playerStatus.currentTime || 0) / playerStatus.duration
            } else {
                progress.value = 0
            }
        } else {
        }
    }, [playerStatus?.currentTime, playerStatus?.duration, isProgressMoving])

    // For controls
    const handlePlayPauseButton = playPauseButtonHandler

    // For tags
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
    const [nowSongId, setNowSongId] = useState('0')

    const tagManagement = useContext(tagContext)
    if (!tagManagement) {
        throw new Error('Tag context is not available')
    }
    const { addTagMask, deleteTageMask, tags, tagsMasks } = tagManagement

    useEffect(() => {
        // When song changed
        setNowSongId(songInfo?.id ? songInfo.id : '0')
    }, [songInfo])

    useEffect(() => {
        // When song id changed, update attached tags to show
        updateAttachedTags(nowSongId)
    }, [nowSongId])

    const updateAttachedTags = (nowSongId: string) => {
        const thisTagsMask = tagsMasks.get(nowSongId)
        if (thisTagsMask === undefined) {
        } else {
            const nextAttachedTags: Set<string> = new Set()
            tags.forEach((tag, index) => {
                if (thisTagsMask[index]) {
                    nextAttachedTags.add(tag)
                }
            })
            setSelectedTags(nextAttachedTags)
        }
    }

    const toggleTagSelection = (tag: string) => {
        setSelectedTags((prev) => {
            const newSelected = new Set(prev)
            const nowSongId = songInfo?.id ? songInfo.id : '0'
            if (newSelected.has(tag)) {
                newSelected.delete(tag)
                deleteTageMask(nowSongId, tag)
            } else {
                newSelected.add(tag)
                addTagMask(nowSongId, tag)
            }
            return newSelected
        })
    }

    const renderTagItem = ({ item }: { item: string }) => (
        <View style={{ marginHorizontal: 3, marginVertical: 3 }}>
            <Chip
                compact={true}
                selected={selectedTags.has(item)}
                showSelectedCheck={false}
                // showSelectedOverlay={true}
                onPress={() => {
                    toggleTagSelection(item)
                }}
                style={{
                    backgroundColor: selectedTags.has(item)
                        ? titleTextColor
                            ? titleTextColor
                            : colors.text
                        : backgroundColor,
                }}
                textStyle={{
                    color: selectedTags.has(item)
                        ? backgroundColor
                        : titleTextColor
                          ? titleTextColor
                          : colors.text,
                }}
            >
                {item}
            </Chip>
        </View>
    )

    // Render player
    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onChange={handleSheetChange}
            enablePanDownToClose={true}
            index={-1}
            animationConfigs={animationConfigs}
            // topInset={top}
            handleComponent={null}
            enableOverDrag={false}
            overDragResistanceFactor={0}
        >
            <BottomSheetView
                style={{
                    ...styles.contentContainer,
                    paddingTop: top,
                    backgroundColor: backgroundColor,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0)',
                    }}
                >
                    {/*Title*/}
                    <TextTicker
                        style={{
                            fontSize: 22,
                            fontWeight: fontWeight.bold,
                            color: titleTextColor ? titleTextColor : colors.text,
                            textAlign: 'center',
                            paddingTop: 25,
                        }}
                        duration={10000}
                        animationType={'scroll'}
                        loop={true}
                        bounce={false}
                        scroll={false}
                    >
                        {songInfo?.title
                            ? `${songInfo?.title || t(i18nTokens.player.emptyTitle)}`
                            : t(i18nTokens.player.emptyTitle)}
                    </TextTicker>
                    {/*Artist*/}
                    <TextTicker
                        style={{
                            fontSize: 16,
                            fontWeight: fontWeight.bold,
                            color: titleTextColor ? titleTextColor + '80' : colors.textMuted + '80',
                            textAlign: 'center',
                            paddingBottom: 25,
                        }}
                        duration={10000}
                        animationType={'scroll'}
                        loop={true}
                        bounce={false}
                        scroll={false}
                    >
                        {songInfo?.artist
                            ? `${songInfo?.artist || t(i18nTokens.player.emptyArtist)}`
                            : t(i18nTokens.player.emptyArtist)}
                    </TextTicker>
                    {/*Cover*/}
                    {songInfo?.cover ? (
                        <Image
                            source={{ uri: songInfo.cover }}
                            style={{ ...styles.songCoverImage }}
                        />
                    ) : (
                        <MaterialIcons
                            name="art-track"
                            size={250}
                            style={{
                                color: colors.textMutedOpacity90Light,
                                backgroundColor: colors.textMutedOpacity30Light,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                ...styles.songCoverImage,
                            }}
                        />
                    )}
                    {/*Lyrics*/}
                    <Text
                        style={{
                            fontSize: 13,
                            height: 60,
                            fontWeight: fontWeight.bold,
                            marginTop: 10,
                            marginBottom: 10,
                            color: lyricsTextColor ? lyricsTextColor : colors.textMuted,
                            textAlign: 'center',
                            justifyContent: 'center',
                            verticalAlign: 'middle',
                            // backgroundColor: 'rgba(0,0,0,0.2)',
                        }}
                        numberOfLines={2}
                    >
                        {currentLyric}
                    </Text>

                    {/*Progress slider*/}
                    <SliderAwesome
                        style={{
                            height: 20,
                            flex: 0,
                        }}
                        theme={{
                            disableMinTrackTintColor: colors.textMuted,
                            maximumTrackTintColor: titleTextColor
                                ? titleTextColor + '80'
                                : colors.textMuted + '80',
                            minimumTrackTintColor: titleTextColor ? titleTextColor : colors.text,
                            cacheTrackTintColor: lyricsTextColor
                                ? lyricsTextColor
                                : colors.textMuted,
                            bubbleBackgroundColor: '#666',
                            heartbeatColor: '#999',
                        }}
                        progress={progress}
                        minimumValue={min}
                        maximumValue={max}
                        onSlidingStart={() => {
                            setIsProgressMoving(false)
                            if (playerStatus?.playing) {
                                setLastPlayPauseState('pause')
                            } else {
                                setLastPlayPauseState('play')
                            }
                            setIsSeeking(true)
                        }}
                        onSlidingComplete={(value) => {
                            // console.log('onValChg')
                            player?.seekTo(
                                playerStatus?.duration ? value * playerStatus?.duration : 0,
                            )
                            if (!playerStatus?.playing) {
                                player?.play()
                            }
                            setTimeout(() => {
                                setIsProgressMoving(true)
                                setIsSeeking(false)
                            }, 500)
                        }}
                        renderBubble={() => {
                            return <Text>{}</Text>
                        }}
                        disable={!songInfo?.title}
                    />

                    {/*Controls*/}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignContent: 'space-evenly',
                            justifyContent: 'space-evenly',
                            paddingVertical: 26,
                        }}
                    >
                        {/*Backward Button*/}
                        <TouchableOpacity onPress={() => handleSongChange(previousSongId)}>
                            <FontAwesome6
                                style={{
                                    color: titleTextColor ? titleTextColor : colors.text,
                                    ...styles.playPauseButtonIcon,
                                }}
                                name={'backward'}
                                size={30}
                            />
                        </TouchableOpacity>
                        {/*Play/Pause Button*/}
                        <TouchableOpacity
                            style={styles.playPauseButton}
                            onPress={() => handlePlayPauseButton(playerStatus, player)}
                        >
                            <FontAwesome6
                                style={{
                                    color: titleTextColor ? titleTextColor : colors.text,
                                    ...styles.playPauseButtonIcon,
                                }}
                                name={
                                    isSeeking
                                        ? lastPlayPauseState
                                        : playerStatus?.playing
                                          ? 'pause'
                                          : 'play'
                                }
                                size={30}
                            />
                        </TouchableOpacity>
                        {/*Forward Button*/}
                        <TouchableOpacity onPress={() => handleSongChange(nextSongId)}>
                            <FontAwesome6
                                style={{
                                    color: titleTextColor ? titleTextColor : colors.text,
                                    ...styles.playPauseButtonIcon,
                                }}
                                name={'forward'}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetView>
            {/*Floating Tags Buttons*/}
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <BottomSheetFlatList
                    data={tags}
                    renderItem={renderTagItem}
                    keyExtractor={(item) => item}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'center' }}
                />
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        height: '100%',
    },
    songCoverImage: {
        borderRadius: 8,
        width: '100%',
        aspectRatio: 1,
        left: 0,
        bottom: 0,
        elevation: 10,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    playPauseButton: {
        transform: [{ translateX: 3 }],
    },
    playPauseButtonIcon: {
        verticalAlign: 'middle',
        textAlignVertical: 'center',
        textAlign: 'center',
        width: 30,
        height: 30,
    },
})

export default Player
