import { Text, View } from 'react-native'
import defaultStyle from '@/styles/style'
import { colors } from '@/constants/tokens'
import TabHeader from '@/components/TabHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import FloatingSearchBar from '@/components/FloatingSearchBar/FloatingSearchBar'
import SearchButton from '@/components/FloatingSearchBar/SearchButton'
import { useState } from 'react'
import { i18nTokens } from '@/i18n/i18nTokens'

export default function TagsTab() {
    const [visible, setVisible] = useState(false)

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
                    tabTitle={i18nTokens.tabs.tags}
                    iconName={'tags'}
                    rotate={'-15deg'}
                    translateY={-35}
                    translateX={-30}
                />
                <View style={{ backgroundColor: '#fff', height: '86%' }}>
                    <FloatingSearchBar visible={visible} />
                    <SearchButton visible={visible} onPress={setVisible} />
                </View>
            </SafeAreaView>
        </View>
    )
}
