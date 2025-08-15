import { View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, tabIcons } from '@/constants/tokens'

type TabName = keyof typeof tabIcons

interface HeaderRightProps {
    tabName: TabName
    rotate?: string
}

const HeaderRight = ({ tabName, rotate = '-45deg' }: HeaderRightProps) => {
    const iconName = tabIcons[tabName] as keyof typeof MaterialCommunityIcons.glyphMap || 'music-circle'
    
    return (
        <View
            style={{
                flex: 1,
                height: '100%',
                overflow: 'visible',
                position: 'relative',
            }}
        >
            <MaterialCommunityIcons
                name={iconName}
                size={120}
                style={{
                    color: colors.primary + '90',
                    position: 'absolute',
                    right: -10,
                    top: '50%',
                    transform: [{ translateY: -30 }, { rotate }],
                }}
            />
        </View>
    )
}

export default HeaderRight