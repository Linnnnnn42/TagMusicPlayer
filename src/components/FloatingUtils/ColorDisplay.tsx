import { View, Text, StyleSheet } from 'react-native'
import { calculateLuminance } from '@/utils/colors'
import { AndroidImageColors } from 'react-native-image-colors/build/types'

type ColorDisplayItemProps = {
    label: string
    color?: string
}

const ColorDisplayItem = ({ label, color }: ColorDisplayItemProps) => {
    if (!color) return null

    const luminance = calculateLuminance(color)
    // Determine the depth (128 is the dividing line, this value can be adjusted)
    const isLight = luminance > 128

    return (
        <View style={styles.colorDisplayContainer}>
            <View style={[styles.colorBox, { backgroundColor: color }]} />
            <Text style={styles.colorLabel}>{label}</Text>
            <Text style={styles.colorValue}>{color}</Text>
            <Text style={styles.luminanceText}>
                {luminance}
                {isLight ? ' Light' : ' Dark'}
            </Text>
        </View>
    )
}

type ColorsDisplayProps = {
    coverColors: AndroidImageColors | null
}

export const ColorsDisplay = ({ coverColors }: ColorsDisplayProps) => {
    if (!coverColors) return null

    const { dominant, average, vibrant, darkVibrant, lightVibrant, darkMuted, lightMuted, muted } =
        coverColors

    const colorItems = [
        { label: 'Dominant', color: dominant },
        { label: 'Average', color: average },
        { label: 'Vibrant', color: vibrant },
        { label: 'Dark Vibrant', color: darkVibrant },
        { label: 'Light Vibrant', color: lightVibrant },
        { label: 'Dark Muted', color: darkMuted },
        { label: 'Light Muted', color: lightMuted },
        { label: 'Muted', color: muted },
    ]

    return (
        <View style={styles.colorsContainer}>
            {colorItems.map((item, index) => (
                <ColorDisplayItem key={index} label={item.label} color={item.color} />
            ))}
        </View>
    )
}

type SortedColorsDisplayProps = {
    colors: { color: string; luminance: number; name: string; isLight: boolean }[]
}

export const SortedColorsDisplay = ({ colors }: SortedColorsDisplayProps) => {
    return (
        <View style={sortedColorsStyles.sortedColorsContainer}>
            <View style={sortedColorsStyles.sortedColorsList}>
                {colors.map((item, index) => (
                    <View key={index} style={sortedColorsStyles.sortedColorItem}>
                        <View
                            style={[
                                sortedColorsStyles.sortedColorBox,
                                { backgroundColor: item.color },
                            ]}
                        />
                        <Text style={sortedColorsStyles.sortedColorText}>
                            {item.name}: {item.luminance.toFixed(0)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    colorsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        bottom: 200,
        width: '95%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    colorDisplayContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(223,251,255,0.85)',
        borderRadius: 10,
        padding: 8,
        margin: 5,
        width: 90,
    },
    colorBox: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 5,
    },
    colorLabel: {
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 2,
    },
    colorValue: {
        fontSize: 10,
        textAlign: 'center',
        color: '#666',
        marginBottom: 2,
    },
    luminanceText: {
        fontSize: 10,
        textAlign: 'center',
        color: '#333',
        marginBottom: 1,
    },
})

const sortedColorsStyles = StyleSheet.create({
    sortedColorsContainer: {
        position: 'absolute',
        right: '15%',
        bottom: 65,
        zIndex: 1,
        width: '50%',
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        marginBottom: 10,
    },
    sortedColorsList: {
        flexDirection: 'column',
    },
    sortedColorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
    },
    sortedColorBox: {
        width: 20,
        height: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
    },
    sortedColorText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
})
