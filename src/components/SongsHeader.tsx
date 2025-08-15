import { Pressable, StyleSheet, Text, View } from 'react-native'
import { songsTabStyles } from '@/styles/style'
import { Dispatch, SetStateAction, useState } from 'react'

const randomHexColor = () => {
    return '#000000'.replace(/0/g, () => {
        return (~~(Math.random() * 16)).toString(16)
    })
}

interface SongsHeaderProps {
    onlyMusicDir: boolean
    setOnlyMusicDir: Dispatch<SetStateAction<boolean>>
}

export const SongsHeader = ({ onlyMusicDir, setOnlyMusicDir }: SongsHeaderProps) => {
    const [rippleColor, setRippleColor] = useState(randomHexColor())

    return (
        <View
            style={{
                flexDirection: 'row-reverse',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                // paddingHorizontal: 20,
                // paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
                // justifyContent: 'flex-end',
                // height: 100,
            }}
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
                    borderColor: '#fff',
                    borderWidth: 0,
                    width: '10%',
                    marginRight: 0,
                    paddingTop: 2,
                }}
            >
                <Text
                    style={{
                        ...songsTabStyles.title,
                        textAlign: 'right',
                    }}
                >
                    {`@`}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    pressable: { margin: 5, padding: 0, borderWidth: 2, borderRadius: 5 },
})
