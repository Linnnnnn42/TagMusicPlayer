import { colors } from '@/constants/tokens'
import { Checkbox } from 'react-native-paper'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'

interface RowCheckboxProps {
    items?: string[]
    center?: boolean
    searchFilters?: string[]
    onSelectionChange?: (selectedItems: string[]) => void
}

const RowCheckBox = ({
    items = ['Default'],
    center = false,
    searchFilters = [],
    onSelectionChange,
}: RowCheckboxProps) => {
    const initialFilters = searchFilters.length > 0 ? searchFilters : [items[0]]

    // UI
    const [disableOne, setDisableOne] = useState(false)

    const clampedItems = items.length > 0 ? items.slice(0, 5) : ['Default']
    const handleToggle = (label: string) => {
        let newSelection
        // Normal Checkbox Logic
        if (initialFilters.includes(label)) {
            newSelection = initialFilters.filter((item) => item !== label)
        } else {
            newSelection = [...initialFilters, label]
        }

        // Prevent 1st one to be disabled when newSelection.length === 0
        if (newSelection.length === 0) {
            newSelection = [...newSelection, label]
            setDisableOne(true)
        } else {
            setDisableOne(false)
        }

        onSelectionChange?.(newSelection)
    }

    return (
        <View style={[styles.container, center && styles.centerContainer]}>
            {clampedItems.map((label, index) => {
                const checked = initialFilters.includes(label)
                const disabled = disableOne && checked
                // console.log(index, checked, label)
                // console.log(initialFilters)

                return (
                    <View key={index} style={styles.checkboxContainer}>
                        <TouchableOpacity
                            style={styles.checkboxWrapper}
                            onPress={() => handleToggle(label)}
                            activeOpacity={0.7}
                            disabled={disabled}
                        >
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                color={colors.primary}
                                onPress={() => handleToggle(label)}
                                disabled={disabled}
                            />
                            <Text style={[styles.label, disabled && styles.disabledLabel]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    centerContainer: {
        justifyContent: 'center',
    },
    checkboxContainer: {
        margin: 5,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginLeft: 5,
        color: colors.text,
    },
    disabledLabel: {
        color: colors.textMuted,
    },
})

export default RowCheckBox
