import { TextStyle } from 'react-native'
import { MD3LightTheme as DefaultTheme } from 'react-native-paper/lib/typescript/styles/themes/v3/LightTheme'

export const colors = {
    primary: '#00b2ff',
    primaryOpacity10: '#00b2ff' + '10',
    primaryOpacity20: '#00b2ff' + '20',
    primaryOpacity30: '#00b2ff' + '30',
    primaryOpacity10Light: 'rgb(237,247,253)',
    primaryOpacity20Light: 'rgb(222,243,253)',
    primaryOpacity30Light: 'rgb(205,240,253)',
    primaryOpacity30Dark: 'rgb(8,36,47)',
    secondary: '#0080ff',
    secondaryOpacity30: '#00d9ff' + '30',
    background: '#fff',
    text: '#000',
    textMuted: '#707070',
    textMutedOpacity30Light: '#e3e3e3',
    textMutedOpacity90Light: '#a2a2a2',
    icon: '#fff',
}

export const paperThemeColors = {
    primary: colors.primary,
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(201, 230, 255)',
    onPrimaryContainer: 'rgb(0, 30, 47)',
    secondary: 'rgb(80, 96, 110)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(211, 229, 245)',
    onSecondaryContainer: 'rgb(12, 29, 41)',
    tertiary: 'rgb(100, 89, 123)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(234, 221, 255)',
    onTertiaryContainer: 'rgb(32, 22, 52)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(252, 252, 255)',
    onBackground: 'rgb(26, 28, 30)',
    surface: 'rgb(252, 252, 255)',
    onSurface: colors.textMuted, // searchBar： placeholderTextColor
    surfaceVariant: 'rgb(221, 227, 234)',
    onSurfaceVariant: colors.primary, // searchBar: textColor
    outline: 'rgb(114, 120, 126)',
    outlineVariant: 'rgb(193, 199, 206)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(46, 49, 51)',
    inverseOnSurface: 'rgb(240, 240, 243)',
    inversePrimary: 'rgb(139, 206, 255)',
    elevation: {
        level0: 'transparent',
        level1: 'rgb(239, 244, 250)',
        level2: 'rgb(232, 240, 246)',
        level3: 'rgb(224, 235, 243)',
        level4: colors.primaryOpacity30Light,
        level5: 'rgb(217, 231, 240)',
    },
    surfaceDisabled: 'rgba(26, 28, 30, 0.12)',
    onSurfaceDisabled: 'rgba(26, 28, 30, 0.38)',
    backdrop: 'rgba(43, 49, 55, 0.4)',
}

export const fontSize: { [key: string]: number } = {
    xxs: 12,
    xs: 14,
    sm: 16,
    medium: 20,
    lg: 24,
    xlg: 36,
    xxlg: 40,
}

export const fontWeight: { [key: string]: TextStyle['fontWeight'] } = {
    normal: 'normal',
    bold: 'bold',
    oneHundred: '100',
    twoHundred: '200',
    threeHundred: '300',
    fourHundred: '400',
    fiveHundred: '500',
    sixHundred: '600',
}

export const tabIcons = {
    playlists: 'playlist-music',
    tags: 'tag-multiple',
    favorites: 'heart',
    songs: 'music-circle',
}

export const screenPadding = {
    horizontal: 24,
}
