import { View } from 'react-native'
import TextTicker from 'react-native-text-ticker'
import { colors, fontWeight } from '@/constants/tokens'
import * as React from 'react'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'

type FloatingPlayerTextProps = {
    songInfoText?: Pick<MinimalMusicInfo, 'title' | 'artist' | 'lyrics'>
}

export const FloatingPlayerText = ({ songInfoText }: FloatingPlayerTextProps) => {
    return (
        <>
            <View
                style={{
                    height: '25%',
                    justifyContent: 'center',
                    marginTop: 10,
                    // backgroundColor: colors.text,
                }}
            >
                <TextTicker
                    style={{
                        fontSize: 15,
                        fontWeight: fontWeight.bold,
                        color: colors.text,
                        textAlign: 'left',
                    }}
                    duration={10000}
                    animationType={'scroll'}
                    loop={true}
                    bounce={false}
                    scroll={false}
                >
                    {songInfoText
                        ? `${songInfoText.title || '未知标题'} - ${songInfoText.artist || '佚名'}`
                        : 'Unknown'}
                </TextTicker>
            </View>
            <View
                style={{
                    height: '25%',
                    justifyContent: 'flex-start',
                    // backgroundColor: colors.text,
                }}
            >
                <TextTicker
                    style={{
                        fontSize: 10,
                        fontWeight: fontWeight.bold,
                        paddingTop: 5,
                        color: colors.textMuted,
                    }}
                    duration={10000}
                    animationType={'scroll'}
                    loop={true}
                    bounce={false}
                    scroll={false}
                >
                    I'm rooooooooooooooolling lyrics... Is it?
                </TextTicker>
            </View>
        </>
    )
}
