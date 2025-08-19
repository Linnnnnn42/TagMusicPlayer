// Function to calculate color luminance
import { AndroidImageColors } from 'react-native-image-colors/build/types'
import { useEffect, useState } from 'react'
import { colors } from '@/constants/tokens'
import { calculateLuminance } from '@/utils/colors'

const useCoverColors = (coverColors: AndroidImageColors | null) => {
    // Deconstruct all color properties of the Android platform
    const { dominant, average, vibrant, darkVibrant, lightVibrant, darkMuted, lightMuted, muted } =
        coverColors || {}

    // Create a state to store colors sorted by luminance
    const [coverColorsByLuminance, setCoverColorsByLuminance] = useState<
        { color: string; luminance: number; name: string; isLight: boolean }[]
    >([])

    const [titleTextColor, setTitleTextColor] = useState('')
    const [lyricsTextColor, setLyricsTextColor] = useState('')

    useEffect(() => {
        // Create color array and calculate luminance
        const colorsWithLuminance = []
        let tmpLuminance = 0
        let tmpIsLight = tmpLuminance > 128

        const fx = (color: string) => {
            tmpLuminance = calculateLuminance(color)
            tmpIsLight = tmpLuminance > 128
        }

        if (dominant) {
            fx(dominant)
            colorsWithLuminance.push({
                color: dominant,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Dominant',
            })
        }

        if (average) {
            fx(average)
            colorsWithLuminance.push({
                color: average,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Average',
            })
        }

        if (vibrant) {
            fx(vibrant)
            colorsWithLuminance.push({
                color: vibrant,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Vibrant',
            })
        }

        if (darkVibrant) {
            fx(darkVibrant)
            colorsWithLuminance.push({
                color: darkVibrant,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Dark Vibrant',
            })
        }

        if (lightVibrant) {
            fx(lightVibrant)
            colorsWithLuminance.push({
                color: lightVibrant,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Light Vibrant',
            })
        }

        if (darkMuted) {
            fx(darkMuted)
            colorsWithLuminance.push({
                color: darkMuted,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Dark Muted',
            })
        }

        if (lightMuted) {
            fx(lightMuted)
            colorsWithLuminance.push({
                color: lightMuted,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Light Muted',
            })
        }

        if (muted) {
            fx(muted)
            colorsWithLuminance.push({
                color: muted,
                luminance: tmpLuminance,
                isLight: tmpIsLight,
                name: 'Muted',
            })
        }

        // Sort by luminance from high to low (light colors first)
        colorsWithLuminance.sort((a, b) => b.luminance - a.luminance)

        // Update state
        setCoverColorsByLuminance(colorsWithLuminance)
        const isBackgroundDarkOrLight = dominant ? calculateLuminance(dominant) <= 128 : true

        // Ensure there are enough colors to set text colors
        if (colorsWithLuminance.length >= 8) {
            if (isBackgroundDarkOrLight) {
                setTitleTextColor(colorsWithLuminance[0].color)
                setLyricsTextColor(colorsWithLuminance[1].color)
                if (
                    colorsWithLuminance[1].color === dominant ||
                    colorsWithLuminance[0].color === dominant
                ) {
                    setTitleTextColor(colorsWithLuminance[6].color)
                    setLyricsTextColor(colorsWithLuminance[7].color)
                }
            } else {
                setTitleTextColor(colorsWithLuminance[6].color)
                setLyricsTextColor(colorsWithLuminance[7].color)
                if (
                    colorsWithLuminance[6].color === dominant ||
                    colorsWithLuminance[7].color === dominant
                ) {
                    setTitleTextColor(colorsWithLuminance[0].color)
                    setLyricsTextColor(colorsWithLuminance[1].color)
                }
            }
        } else if (colorsWithLuminance.length > 0) {
            // If there are less than 8 colors, use available colors
            setTitleTextColor(colorsWithLuminance[0].color)
            setLyricsTextColor(
                colorsWithLuminance[Math.min(1, colorsWithLuminance.length - 1)]?.color ||
                    colors.text,
            )
        } else {
            // If there is no color information, use default colors
            setTitleTextColor(colors.text)
            setLyricsTextColor(colors.textMuted)
        }
    }, [dominant, average, vibrant, darkVibrant, lightVibrant, darkMuted, lightMuted, muted])

    return {
        coverColorsByLuminance,
        titleTextColor,
        lyricsTextColor,
    }
}

export default useCoverColors
