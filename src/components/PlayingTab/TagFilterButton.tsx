import { colors } from '@/constants/tokens'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { FunctionComponent, useState } from 'react'
import { useTheme } from 'react-native-paper'
import { TagFilterState } from '@/hooks/playingTab/useTagFilter'

interface TagFilterButtonProps {
    tag: string
    initialState?: TagFilterState
    onPress?: (state: TagFilterState) => void
}

export const TagFilterButton: FunctionComponent<TagFilterButtonProps> = ({
    tag,
    initialState = 'neutral',
    onPress,
}) => {
    const theme = useTheme()
    const [state, setState] = useState<TagFilterState>(initialState)

    const getNextState = (): TagFilterState => {
        switch (state) {
            case 'neutral':
                return 'include'
            case 'include':
                return 'exclude'
            case 'exclude':
                return 'neutral'
            default:
                return 'neutral'
        }
    }

    const handlePress = () => {
        const nextState = getNextState()
        setState(nextState)
        onPress?.(nextState)
    }

    const getBackgroundColor = () => {
        switch (state) {
            case 'include':
                return colors.primaryOpacity20Light
            case 'exclude':
                return theme.colors.errorContainer
            case 'neutral':
            default:
                return theme.colors.surfaceVariant
        }
    }

    const buttonStyles = StyleSheet.create({
        button: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            margin: 2,
            borderRadius: 16,
            backgroundColor: getBackgroundColor(),
            minWidth: 40,
            alignItems: 'center',
        },
        text: {
            color: theme.colors.onSurface,
            fontSize: 13,
            fontWeight: '500',
        },
    })

    return (
        <TouchableOpacity style={buttonStyles.button} onPress={handlePress}>
            <Text style={buttonStyles.text}>{tag}</Text>
        </TouchableOpacity>
    )
}
