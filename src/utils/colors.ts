// Function to calculate color luminance
export const calculateLuminance = (hex: string): number => {
    // Remove # prefix
    const cleanHex = hex.replace('#', '')

    // Convert hexadecimal to RGB components
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)

    // Calculate luminance using the standard formula
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b)
}
