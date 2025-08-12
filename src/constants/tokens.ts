import { TextStyle } from 'react-native'

export const colors = {
    primary: '#00b2ff',
    primaryOpacity30: '#00b2ff' + '30',
    secondary: '#00d9ff',
    secondaryOpacity30: '#00d9ff' + '30',
    background: '#fff',
    text: '#000',
    textMuted: '#707070',
    icon: '#fff',
}

export const fontSize: { [key: string]: number } = {
    xs: 12,
    sm: 16,
    medium: 20,
    lg: 24,
    xlg: 36,
    xxlg: 40,
}

export const fontWeight: { [key: string]: TextStyle['fontWeight'] } = {
    normal: 'normal',
    bold: 'bold',
    bolder: '900',
    lighter: '200',
}

export const screenPadding = {
    horizontal: 24,
}
