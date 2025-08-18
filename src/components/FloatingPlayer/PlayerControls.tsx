import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/constants/tokens'
import * as React from 'react'
import { AudioStatus } from 'expo-audio'

interface PlayerControlsProps {
    playerStatus?: AudioStatus | undefined
}

export const PlayerControls = ({ playerStatus }: PlayerControlsProps) => {
    return (
        <View
            style={{
                height: 40,
                flexDirection: 'row',
                position: 'absolute',
            }}
        >
            <ToPrevButton />
            <PlayPauseButton size={20} />
            <ToNextButton />
        </View>
    )
}

const ToPrevButton = () => {
    return (
        <TouchableOpacity>
            <Ionicons
                name="play-back"
                size={20}
                style={{
                    ...styles.buttons,
                    left: -25,
                }}
            />
        </TouchableOpacity>
    )
}

export const PlayPauseButton = ({ size, styleProps }: { size: number; styleProps?: {} }) => {
    return (
        <TouchableOpacity>
            <Ionicons
                name="play"
                size={size}
                style={{
                    ...styles.buttons,
                    left: 3,
                    ...styleProps,
                }}
            />
        </TouchableOpacity>
    )
}

const ToNextButton = () => {
    return (
        <TouchableOpacity>
            <Ionicons
                name="play-forward"
                size={20}
                style={{
                    ...styles.buttons,
                    left: 25,
                }}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttons: {
        color: colors.text,
        // backgroundColor: colors.textMutedOpacity30Light,
        position: 'relative',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
})
