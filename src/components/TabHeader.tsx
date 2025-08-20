import { colors, fontSize, fontWeight, tabIcons } from '@/constants/tokens'
import { Text, View } from 'react-native'
import TabHeaderRight from '@/components/TabHeaderRight'
import { useTranslation } from 'react-i18next'

export interface TabHeaderProps {
    tabTitle: string
    iconName: keyof typeof tabIcons
    rotate?: string

    translateY?: number
    translateX?: number
}

const TabHeader = ({
    tabTitle,
    iconName,
    rotate = '-45deg',
    translateY = -30,
    translateX = 0,
}: TabHeaderProps) => {
    const { t } = useTranslation()

    return (
        <View style={{ height: '14%', backgroundColor: colors.primaryOpacity30 + '30' }}>
            {/*plus 30 to counteract opacity*/}
            <Text
                style={{
                    fontSize: fontSize.xxlg,
                    fontWeight: fontWeight.bold,
                    color: colors.primary,
                    position: 'absolute',
                    top: '20%',
                    left: '8%',
                }}
            >
                {t(tabTitle)}
            </Text>
            <TabHeaderRight
                iconName={iconName}
                rotate={rotate}
                translateY={translateY}
                translateX={translateX}
            />
        </View>
    )
}

export default TabHeader
