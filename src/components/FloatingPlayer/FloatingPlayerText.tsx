import { View } from 'react-native'
import TextTicker from 'react-native-text-ticker'
import { colors, fontWeight } from '@/constants/tokens'
import * as React from 'react'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'

type FloatingPlayerTextProps = {
    songInfoText?: Pick<MinimalMusicInfo, 'title' | 'lyrics'>
    currentLyric?: string
}

export const FloatingPlayerText = ({ songInfoText, currentLyric }: FloatingPlayerTextProps) => {
    return (
        <View
            style={{
                // backgroundColor: colors.text,
                flexDirection: 'column',
                width: '55%',
                alignContent: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View>
                <TextTicker
                    style={{
                        fontSize: 15,
                        fontWeight: fontWeight.bold,
                        color: colors.text,
                        textAlign: 'center',
                    }}
                    duration={10000}
                    animationType={'scroll'}
                    loop={true}
                    bounce={false}
                    scroll={false}
                >
                    {songInfoText ? `${songInfoText.title || '未知标题'}` : 'Unknown'}
                </TextTicker>
            </View>
            <View>
                <TextTicker
                    style={{
                        fontSize: 10,
                        fontWeight: fontWeight.bold,
                        paddingTop: 4,
                        color: colors.textMuted,
                        textAlign: 'center',
                    }}
                    duration={10000}
                    animationType={'scroll'}
                    loop={true}
                    bounce={false}
                    scroll={false}
                >
                    {currentLyric}
                </TextTicker>
            </View>
        </View>
    )
}
