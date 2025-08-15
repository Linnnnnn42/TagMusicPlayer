import { Button, View, Text } from 'react-native'
import defaultStyle from '@/styles/style'
import { Stack } from 'expo-router'
import { StackScreenWithSearchBar, getHeaderRight } from '@/constants/options'

export default function SongsTabLayout() {
    return (
        <View style={defaultStyle.container}>
            <Stack>
                <Stack.Screen
                    name={'index'}
                    options={{
                        ...StackScreenWithSearchBar,
                        headerTitle: 'Songs',
                        headerRight: getHeaderRight('songs', '-30deg'),
                    }}
                />
            </Stack>
        </View>
    )
}
