import { getColors, ImageColorsResult } from 'react-native-image-colors'
import { useEffect, useState } from 'react'

const useImageColors = (uri: string | undefined) => {
    const [colors, setColors] = useState<ImageColorsResult | null>(null)

    useEffect(() => {
        if (uri) {
            getColors(uri).then((result) => setColors(result))
        }
    }, [uri])

    return colors
}

export default useImageColors
