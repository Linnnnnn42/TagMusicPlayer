import { TextStyle } from 'react-native'

export const colors = {
    primary: '#00b2ff',
    primaryOpacity10: '#00b2ff' + '10',
    primaryOpacity30: '#00b2ff' + '30',
    secondary: '#0080ff',
    secondaryOpacity30: '#00d9ff' + '30',
    background: '#fff',
    text: '#000',
    textMuted: '#707070',
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
