import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/constants/tokens'
import { ProgressBar } from 'react-native-paper'
import * as React from 'react'

export const PlayerControls = () => {
    return (
        <View
            style={{
                height: 40,
                flexDirection: 'row',
                paddingBottom: 5,
                // justifyContent: 'flex-start',
                // backgroundColor: colors.text,
            }}
        >
            <ToPrevButton />
            <PlayPauseButton />
            <ToNextButton />
        </View>
    )
}

const ToPrevButton = () => {
    return (
        <Ionicons
            name="play-back"
            size={20}
            style={{
                color: colors.text,
                // backgroundColor: colors.textMutedOpacity30Light,
                position: 'relative',
                textAlign: 'center',
                textAlignVertical: 'center',
                borderRadius: 8,
                // width: 30,
                // height: 30,
                left: -29,
                // top: 64,
                elevation: 0,
            }}
        />
    )
}

const PlayPauseButton = () => {
    return (
        <Ionicons
            name="play"
            size={20}
            style={{
                color: colors.text,
                // backgroundColor: colors.textMutedOpacity30Light,
                position: 'relative',
                textAlign: 'center',
                textAlignVertical: 'center',
                borderRadius: 8,
                elevation: 0,
            }}
        />
    )
}

const ToNextButton = () => {
    return (
        <Ionicons
            name="play-forward"
            size={20}
            style={{
                color: colors.text,
                // backgroundColor: colors.textMutedOpacity30Light,
                position: 'relative',
                textAlign: 'center',
                textAlignVertical: 'center',
                borderRadius: 8,
                // width: 30,
                // height: 30,
                left: 25,
                // top: 64,
                elevation: 0,
            }}
        />
    )
}
