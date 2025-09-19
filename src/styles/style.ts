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

export const songListStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    songEmptyCoverImage: {
        borderRadius: 16,
        width: 150,
        height: 150,
        top: 35,
        color: colors.textMutedOpacity90Light,
        backgroundColor: colors.textMutedOpacity30Light,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
})

export const utilsStyles = StyleSheet.create({})

export default defaultStyle
