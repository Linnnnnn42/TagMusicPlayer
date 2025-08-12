import { Button, View } from 'react-native'
import defaultStyle from '@/styles/style'
import { Stack } from 'expo-router'
import { StackScreenWithSearchBar } from '@/constants/options'

export default function SongsTabLayout() {
    return (
        <View style={defaultStyle.container}>
            <Stack>
                <Stack.Screen
                    name={'index'}
                    options={{
                        ...StackScreenWithSearchBar,
                        headerTitle: 'Songs',
                    }}
                />
            </Stack>
        </View>
    )
}
