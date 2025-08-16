import { StyleSheet } from 'react-native'
import { colors, fontSize, fontWeight } from '@/constants/tokens'

const defaultStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    text: {
        fontSize: fontSize.medium,
        color: colors.text,
    },
})

export const tabsStyles = StyleSheet.create({
    contentContainer: { backgroundColor: '#fff', height: '86%' },
})

export const utilsStyles = StyleSheet.create({})

export default defaultStyle
