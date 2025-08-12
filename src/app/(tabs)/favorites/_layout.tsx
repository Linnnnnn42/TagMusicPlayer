import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { Stack } from 'expo-router'

export default function FavoritesTabLayout() {
    return (
        <View style={defaultStyle.container}>
            <Stack>
                <Stack.Screen name={'index'} options={{ headerTitle: 'Favorites' }} />
            </Stack>
        </View>
    )
}
