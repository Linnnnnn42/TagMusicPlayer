import { colors } from '@/constants/tokens'
import { Checkbox } from 'react-native-paper'
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface CheckboxItem {
    label: string
    checked: boolean
}

interface RowCheckboxProps {
    items?: string[]
    center?: boolean
    onSelectionChange?: (selectedItems: string[]) => void
}

const RowCheckBox = ({
    items = ['Default'],
    center = false,
    onSelectionChange,
}: RowCheckboxProps) => {
    const clampedItems = items.length > 0 ? items.slice(0, 5) : ['Default']

    const initialCheckboxes: CheckboxItem[] = clampedItems.map((label) => ({
        label,
        checked: false,
    }))

    const [checkboxes, setCheckboxes] = useState<CheckboxItem[]>(initialCheckboxes)

    useEffect(() => {
        if (onSelectionChange) {
            const selectedItems = checkboxes
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.label)
            onSelectionChange(selectedItems)
        }
    }, [checkboxes, onSelectionChange])

    const toggleCheckbox = (index: number) => {
        setCheckboxes((prev) =>
            prev.map((checkbox, i) =>
                i === index ? { ...checkbox, checked: !checkbox.checked } : checkbox,
            ),
        )
    }

    return (
        <View style={[styles.container, center && styles.centerContainer]}>
            {checkboxes.map((checkbox, index) => (
                <View key={index} style={styles.checkboxContainer}>
                    <TouchableOpacity
                        style={styles.checkboxWrapper}
                        onPress={() => toggleCheckbox(index)}
                        activeOpacity={0.3}
                    >
                        <Checkbox
                            status={checkbox.checked ? 'checked' : 'unchecked'}
                            color={colors.primary}
                            onPress={() => toggleCheckbox(index)}
                        />
                        <Text style={styles.label}>{checkbox.label}</Text>
                    </TouchableOpacity>
                </View>
            ))}
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
        color: colors.primary,
    },
})

export default RowCheckBox
