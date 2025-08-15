import { Button, View, Text } from 'react-native'
import defaultStyle from '@/styles/style'
import { Stack } from 'expo-router'
import { StackScreenWithSearchBar, getHeaderRight } from '@/constants/options'
import { SongsHeader } from '@/components/SongsHeader'
import { useState } from 'react'

export default function SongsTabLayout() {
    const [onlyMusicDir, setOnlyMusicDir] = useState(true)

    return (
        <View style={defaultStyle.container}>
            <Stack>
                <Stack.Screen
                    name={'index'}
                    options={{
                        ...StackScreenWithSearchBar,
                        headerTitle: 'Songs',
                        headerLeft: () => (
                            <SongsHeader
                                onlyMusicDir={onlyMusicDir}
                                setOnlyMusicDir={setOnlyMusicDir}
                            />
                        ),
                        // headerRight: getHeaderRight(
                        //     'songs',
                        //     '-30deg',
                        //     // -80,
                        //     // -250,
                        // ),
                    }}
                />
            </Stack>
        </View>
    )
}
