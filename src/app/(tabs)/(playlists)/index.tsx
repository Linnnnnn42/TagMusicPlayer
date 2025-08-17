import { View } from 'react-native'
import defaultStyle from '@/styles/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/tokens'
import TabHeader from '@/components/TabHeader'
import FloatingSearchBar from '@/components/FloatingSearchBar/FloatingSearchBar'
import { useState } from 'react'
import SearchButton from '@/components/FloatingSearchBar/SearchButton'

export default function PlaylistsTab() {
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
                <TabHeader // height: '14%'
                    tabTitle={'Playlists'}
                    iconName={'playlists'}
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
