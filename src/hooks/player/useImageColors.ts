import { getColors, ImageColorsResult } from 'react-native-image-colors'
import { useEffect, useState } from 'react'

const useImageColors = (id: string, coverUri: string | undefined) => {
    const [colors, setColors] = useState<ImageColorsResult | null>(null)

    useEffect(() => {
        if (coverUri) {
            getColors(coverUri, {
                cache: true,
                key: id,
            }).then((result) => setColors(result))
        }
    }, [id])

    return colors
}

export default useImageColors
