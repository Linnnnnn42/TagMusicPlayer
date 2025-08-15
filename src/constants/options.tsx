import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { colors, fontSize, fontWeight } from '@/constants/tokens'
import { View } from 'react-native'
import HeaderRight from '@/components/HeaderRight'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
    headerTitleStyle: {
        fontSize: fontSize.xxlg,
        fontWeight: fontWeight.bold,
        // color: colors.text,
    },
    headerStyle: {
        backgroundColor: colors.primaryOpacity30,
    },
    // headerTransparent: true,
    headerShadowVisible: false,
    headerTintColor: colors.primary,
    headerLeft: () => <View style={{ width: 20, height: 100 }} />,
}

// get customized headerRightComponent by tabName
export const getHeaderRight =
    (
        tabName: 'playlists' | 'tags' | 'favorites' | 'songs',
        rotate?: string,
        translateY?: number,
        translateX?: number,
    ) =>
    () => (
        <HeaderRight
            tabName={tabName}
            rotate={rotate}
            translateY={translateY}
            translateX={translateX}
        />
    )
