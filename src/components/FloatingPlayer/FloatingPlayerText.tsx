import { View } from 'react-native'
import TextTicker from 'react-native-text-ticker'
import { colors, fontWeight } from '@/constants/tokens'
import * as React from 'react'
import { MinimalMusicInfo } from '@/database/types'
import { i18nTokens } from '@/i18n/i18nTokens'
import { t } from 'i18next'

type FloatingPlayerTextProps = {
    songInfoText?: Pick<MinimalMusicInfo, 'title' | 'lyrics'>
    currentLyric?: string
    titleTextColor?: string
    lyricsTextColor?: string
}

export const FloatingPlayerText = ({
    songInfoText,
    currentLyric,
    titleTextColor,
    lyricsTextColor,
}: FloatingPlayerTextProps) => {
    return (
        <View
            style={{
                // backgroundColor: colors.text,
                flexDirection: 'column',
                width: '60%',
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
                        color: titleTextColor ? titleTextColor : colors.text,
                        textAlign: 'center',
                    }}
                    duration={10000}
                    animationType={'scroll'}
                    loop={true}
                    bounce={false}
                    scroll={false}
                >
                    {songInfoText
                        ? `${songInfoText.title || t(i18nTokens.player.emptyTitle)}`
                        : t(i18nTokens.player.emptyTitle)}
                </TextTicker>
            </View>
            <View>
                <TextTicker
                    style={{
                        fontSize: 10,
                        fontWeight: fontWeight.bold,
                        paddingTop: 3,
                        marginBottom: 3,
                        color: lyricsTextColor ? lyricsTextColor : colors.textMuted,
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
