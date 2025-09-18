import { colors } from '@/constants/tokens'
import { StyleSheet, Text } from 'react-native'

export const UniformListUtilComponent = ({ text }: { text: string }) => {
    return <Text style={styles.text}>{text}</Text>
}

const styles = StyleSheet.create({
    text: {
        paddingVertical: 5,
        textAlign: 'center',
        color: colors.textMuted,
        fontStyle: 'italic',
    },
})
