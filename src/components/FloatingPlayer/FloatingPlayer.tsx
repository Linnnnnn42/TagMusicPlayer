import { colors, fontWeight } from '@/constants/tokens'
import { Searchbar, Surface } from 'react-native-paper'
import { View, Text, StyleSheet, Animated } from 'react-native'
import TextTicker from 'react-native-text-ticker'
import * as React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { Ionicons } from '@expo/vector-icons'

type FloatingSearchBarProps = {
    songInfo?: MinimalMusicInfo
    onSongChange?: (text: string) => void
}

const FloatingPlayer = ({ songInfo, onSongChange }: FloatingSearchBarProps) => {
    if (songInfo) return null

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // alignSelf: 'center',
                position: 'absolute',
                bottom: 75,
                left: 0,
                height: 100,
                width: '100%',
                // backgroundColor: colors.text,

                zIndex: 2,
            }}
        >
            <Surface style={styles.surface} elevation={4} mode={'elevated'}>
                <MaterialIcons
                    name="art-track"
                    size={95}
                    style={{
                        color: colors.textMutedOpacity90Light,
                        backgroundColor: colors.textMutedOpacity30Light,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        borderRadius: 8,
                        width: 120,
                        height: 120,
                        left: '0%',
                        top: -20,
                        elevation: 10,
                    }}
                />
                <View
                    style={{
                        flexDirection: 'column',
                        // backgroundColor: colors.text,
                        width: '60%',
                        // justifyContent: 'space-e',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}
                >
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
                            This is a song.
                        </TextTicker>
                    </View>
                    <View
                        style={{
                            height: '30%',
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
                    <View
                        style={{
                            height: '30%',
                            flexDirection: 'row',
                            paddingBottom: 5,
                            // justifyContent: 'flex-start',
                            // backgroundColor: colors.text,
                        }}
                    >
                        <Ionicons
                            name="play-back"
                            size={20}
                            style={{
                                color: colors.text,
                                // backgroundColor: colors.textMutedOpacity30Light,
                                position: 'relative',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                borderRadius: 8,
                                // width: 30,
                                // height: 30,
                                left: -29,
                                // top: 64,
                                elevation: 0,
                            }}
                        />
                        <Ionicons
                            name="play"
                            size={20}
                            style={{
                                color: colors.text,
                                // backgroundColor: colors.textMutedOpacity30Light,
                                position: 'relative',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                borderRadius: 8,
                                elevation: 0,
                            }}
                        />
                        <Ionicons
                            name="play-forward"
                            size={20}
                            style={{
                                color: colors.text,
                                // backgroundColor: colors.textMutedOpacity30Light,
                                position: 'relative',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                borderRadius: 8,
                                // width: 30,
                                // height: 30,
                                left: 25,
                                // top: 64,
                                elevation: 0,
                            }}
                        />
                    </View>
                </View>
            </Surface>
        </View>
    )
}

export default FloatingPlayer

const styles = StyleSheet.create({
    surface: {
        width: '90%',
        height: '100%',
        flexDirection: 'row',
        // backgroundColor: colors.primary,
        borderRadius: 20,
    },
    textTicker: {},
})
