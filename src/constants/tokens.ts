import { TextStyle } from 'react-native'

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
