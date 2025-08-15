import { Pressable, StyleSheet, Text, View, ViewProps } from 'react-native'
import { songsTabStyles } from '@/styles/style'
import { Dispatch, SetStateAction, useState } from 'react'
import { colors, fontSize } from '@/constants/tokens'

const randomHexColor = () => {
    return '#000000'.replace(/0/g, () => {
        return (~~(Math.random() * 16)).toString(16)
    })
}

interface SongsHeaderProps extends ViewProps {
    onlyMusicDir: boolean
    setOnlyMusicDir: Dispatch<SetStateAction<boolean>>
}

export const SongsHeader = ({ onlyMusicDir, setOnlyMusicDir, style }: SongsHeaderProps) => {
    const [rippleColor, setRippleColor] = useState(randomHexColor())

    return (
        <>
            <View style={{ width: 20, height: 100 }} />
            <View
                style={[
                    {
                        flexDirection: 'row-reverse',
                        borderBottomWidth: 0,
                        borderBottomColor: '#e0e0e0',
                        position: 'absolute',
                        left: '-10%',
                        top: '45%',
                        width: '100%',
                        zIndex: 1,
                    },
                    // style,
                ]}
            >
                <Pressable
                    android_ripple={{
                        color: rippleColor,
                        borderless: false,
                        foreground: false,
                    }}
                    style={{
                        ...styles.pressable,
                        borderColor: rippleColor + '50',
                        width: '35%',
                        borderWidth: 2,
                        borderRadius: 5,
                    }}
                    onPress={() => {
                        setRippleColor(randomHexColor())
                    }}
                    onLongPress={() => {
                        setOnlyMusicDir(!onlyMusicDir)
                    }}
                    hitSlop={7}
                    pressRetentionOffset={150}
                >
                    <Text
                        style={{
                            ...songsTabStyles.title,
                            textAlign: 'left',
                            color: rippleColor,
                        }}
                    >
                        {onlyMusicDir ? ` Music Lib` : ` Full Disk`}
                    </Text>
                </Pressable>

                <Pressable
                    style={{
                        ...styles.pressable,
                        width: '10%',
                        marginRight: 0,
                        paddingTop: 2,
                    }}
                >
                    <Text
                        style={{
                            ...songsTabStyles.title,
                            textAlign: 'right',
                            color: colors.primary,
                        }}
                    >
                        {`@`}
                    </Text>
                </Pressable>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    pressable: { margin: 5, padding: 0 },
})
