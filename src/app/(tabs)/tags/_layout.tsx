import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { Stack } from 'expo-router'
import { StackScreenWithSearchBar, getHeaderRight } from '@/constants/options'

export default function TagsTabLayout() {
    return (
        <View style={defaultStyle.container}>
            <Stack>
                <Stack.Screen
                    name={'index'}
                    options={{
                        ...StackScreenWithSearchBar,
                        headerTitle: 'Tags',
                        headerRight: getHeaderRight('tags', '-45deg'),
                    }}
                />
            </Stack>
        </View>
    )
}
