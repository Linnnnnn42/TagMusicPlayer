import { colors } from '@/constants/tokens'
import { tabsStyles } from '@/styles/style'
import { FAB } from 'react-native-paper'
import * as React from 'react'
import { StyleSheet } from 'react-native'

type SearchButtonProps = {
    visible: boolean
    bottom?: number
    onPress: (visible: boolean) => void
}

const SearchButton = ({ visible, bottom = 130, onPress }: SearchButtonProps) => {
    return (
        <FAB
            icon={'magnify'}
            color={colors.background}
            // size={'large'}
            customSize={70}
            mode={'elevated'}
            style={{ bottom: bottom, ...styles.searchButton }}
            onPress={() => onPress(!visible)}
        />
    )
}

export default SearchButton

const styles = StyleSheet.create({
    searchButton: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: colors.primary,
        position: 'absolute',
        right: 20,
        zIndex: 1,
    },
})
