import { colors } from '@/constants/tokens'
import { tabsStyles } from '@/styles/style'
import { FAB } from 'react-native-paper'
import * as React from 'react'
import { StyleSheet } from 'react-native'

type SearchButtonProps = {
    visible: boolean
    onPress: (visible: boolean) => void
}

const SearchButton = ({ visible, onPress }: SearchButtonProps) => {
    return (
        <FAB
            icon={'magnify'}
            color={colors.background}
            // size={'large'}
            customSize={70}
            style={styles.searchButton}
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
        bottom: 20,
        right: 20,
        zIndex: 1,
    },
})
