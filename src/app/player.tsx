import React, {
    useCallback,
    useRef,
    useMemo,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from 'react'
import { StyleSheet, View, Text } from 'react-native'
import BottomSheet, {
    BottomSheetView,
    useBottomSheetSpringConfigs,
    useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet'
import { BackHandler } from 'react-native'
import { Easing } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import defaultStyle from '@/styles/style'
import { colors } from '@/constants/tokens'

export type PlayerHandle = {
    openPlayer: () => void
    closePlayer: () => void
}

const Player = forwardRef<PlayerHandle>((_, ref) => {
    // hooks
    const sheetRef = useRef<BottomSheet>(null)
    const currentIndexRef = useRef<number>(-1)

    // variables
    const snapPoints = useMemo(() => ['100%'], [])
    const { top } = useSafeAreaInsets()

    // animation configs with timing
    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
    })

    // callbacks
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
    useImperativeHandle(ref, () => ({
        openPlayer: () => handleSnapPress(0),
        closePlayer: () => handleClosePress(),
    }))

    // render
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
        >
            <BottomSheetView style={{ ...styles.contentContainer, paddingTop: top }}>
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        // backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                ></View>
            </BottomSheetView>
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: colors.secondary,
        height: '100%',
    },
})

export default Player
