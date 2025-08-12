import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { Stack } from 'expo-router'

export default function SongsTabLayout() {
    return (
        <View style={defaultStyle.container}>
            <Stack>
                <Stack.Screen name={'index'} options={{ headerTitle: 'Songs' }} />
            </Stack>
        </View>
    )
}
