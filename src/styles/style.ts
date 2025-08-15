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

export const utilsStyles = StyleSheet.create({})

export const songsTabStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    assetItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    assetInfo: {
        flex: 1,
        marginRight: 10,
    },
    assetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    assetDetails: {
        fontSize: 14,
        color: '#666',
    },
    assetDate: {
        fontSize: 12,
        color: '#999',
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
})

export default defaultStyle
