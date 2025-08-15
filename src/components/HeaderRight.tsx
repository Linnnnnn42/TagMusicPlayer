import { View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, tabIcons } from '@/constants/tokens'

type TabName = keyof typeof tabIcons

interface HeaderRightProps {
    tabName: TabName
    rotate?: string
    translateY?: number | undefined
    translateX?: number | undefined
}

const HeaderRight = ({ tabName, rotate = '-45deg', translateY, translateX }: HeaderRightProps) => {
    const iconName =
        (tabIcons[tabName] as keyof typeof MaterialCommunityIcons.glyphMap) || 'music-circle'

    return (
        <View
            style={{
                flex: 1,
                // height: '100%',
                overflow: 'visible',
                position: 'relative',
                width: 20,
                height: 100,
            }}
        >
            <MaterialCommunityIcons
                name={iconName}
                size={120}
                style={{
                    color: colors.primary + '50',
                    position: 'absolute',
                    right: -20,
                    top: '50%',
                    transform: [
                        {
                            translateY: translateY !== undefined ? translateY : -30,
                        },
                        {
                            translateX: translateX !== undefined ? translateX : 0,
                        },
                        { rotate },
                    ],
                }}
            />
        </View>
    )
}

export default HeaderRight
