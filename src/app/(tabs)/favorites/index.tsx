import { Text, View } from 'react-native'
import defaultStyle from '@/styles/style'
import { colors } from '@/constants/tokens'
import TabHeader from '@/components/TabHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FavoritesTab() {
    return (
        <View style={{ backgroundColor: colors.background, height: '100%' }}>
            <SafeAreaView
                style={{
                    ...defaultStyle.container,
                    backgroundColor: colors.primaryOpacity30,
                    height: 'auto',
                }}
            >
                <TabHeader
                    tabTitle={'Favorites'}
                    iconName={'favorites'}
                    rotate={'-15deg'}
                    translateY={-35}
                    translateX={-30}
                />
            </SafeAreaView>
        </View>
    )
}
