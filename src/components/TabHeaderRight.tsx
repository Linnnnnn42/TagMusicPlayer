import { View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, tabIcons } from '@/constants/tokens'
import { TabHeaderProps } from '@/components/TabHeader'

type TabHeaderRightProps = Omit<TabHeaderProps, 'tabTitle'>

const TabHeaderRight = ({
    iconName,
    rotate = '-45deg',
    translateY = -30,
    translateX = 0,
}: TabHeaderRightProps) => {
    const icon =
        (tabIcons[iconName] as keyof typeof MaterialCommunityIcons.glyphMap) || 'music-circle'

    return (
        // <View
        //     style={{
        //         flex: 1,
        //         // height: '100%',
        //         overflow: 'visible',
        //         position: 'relative',
        //         width: 20,
        //         height: 100,
        //     }}
        // >
        <MaterialCommunityIcons
            name={icon}
            size={120}
            style={{
                color: colors.primary + '50',
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: [
                    {
                        translateY: translateY,
                    },
                    {
                        translateX: translateX,
                    },
                    { rotate },
                ],
            }}
        />
        // </View>
    )
}

export default TabHeaderRight
