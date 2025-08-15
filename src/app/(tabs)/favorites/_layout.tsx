import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { Stack } from 'expo-router'
import { StackScreenWithSearchBar, getHeaderRight } from '@/constants/options'

export default function FavoritesTabLayout() {
    return (
        <View style={defaultStyle.container}>
            <Stack>
                <Stack.Screen
                    name={'index'}
                    options={{
                        ...StackScreenWithSearchBar,
                        headerTitle: 'Favorites',
                        headerRight: getHeaderRight('favorites', '-15deg'),
                    }}
                />
            </Stack>
        </View>
    )
}
