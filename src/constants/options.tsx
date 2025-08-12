import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { colors, fontSize, fontWeight } from '@/constants/tokens'
import { View } from 'react-native'

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
