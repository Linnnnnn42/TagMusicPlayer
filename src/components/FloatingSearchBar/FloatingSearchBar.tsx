import { colors } from '@/constants/tokens'
import { Searchbar, Surface } from 'react-native-paper'
import { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import RowCheckBox from '@/components/FloatingSearchBar/RowCheckbox'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

type FloatingSearchBarProps = {
    visible?: boolean
    hideOffset?: number
    searchContent?: string
    onSearchChange?: (text: string) => void
    searchFilters?: string[]
    onSelectionChange?: (selections: string[]) => void
    ref?: React.Ref<{ focus: () => void }>
}

export const byTitle = 'floatingSearchBar.filters.title'
export const byArtist = 'floatingSearchBar.filters.artist'
export const byLyrics = 'floatingSearchBar.filters.lyrics'

const FloatingSearchBar = ({
    visible = true,
    hideOffset = -300,
    searchContent = '',
    onSearchChange,
    searchFilters,
    onSelectionChange,
    ref,
}: FloatingSearchBarProps) => {
    const { t, ready } = useTranslation()

    // UI / Animation
    const animatedValue = useRef(new Animated.Value(visible ? 1 : 0)).current
    const [visibility, setVisibility] = useState(visible)
    const searchbarRef = useRef<any>(null)
    React.useImperativeHandle(ref, () => ({
        focus: () => {
            setTimeout(() => {
                searchbarRef.current?.focus()
            }, 100) // Delay to ensure animation completion
        },
    }))
    const translateYValue = React.useMemo(() => {
        return animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [hideOffset, 0],
        })
    }, [animatedValue, hideOffset])

    useEffect(() => {
        if (visible) {
            setVisibility(true)
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Focus search bar after animation completes
                setTimeout(() => {
                    searchbarRef.current?.focus()
                }, 100)
            })
        } else {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVisibility(false)
            })
        }
    }, [visible, animatedValue])

    // 如果翻译尚未准备好，返回 null
    if (!visibility || !ready) {
        return null
    }

    return (
        <View
            style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: colors.background,
                paddingTop: 10,
                zIndex: 1,
                position: 'absolute',
            }}
        >
            <Animated.View
                style={[
                    {
                        width: '100%',
                        alignItems: 'center',
                        transform: [
                            {
                                translateY: translateYValue,
                            },
                        ],
                    },
                ]}
            >
                <Surface style={styles.surface} elevation={4}>
                    <View style={{ width: '100%' }}>
                        <Searchbar
                            ref={searchbarRef}
                            value={searchContent}
                            placeholder={t('floatingSearchBar.placeholder')}
                            searchAccessibilityLabel={'Find in songs'}
                            mode={'bar'}
                            onChangeText={onSearchChange}
                            theme={{ colors: { onSurfaceVariant: 'black' } }}
                        />
                        <RowCheckBox
                            items={[t(byTitle), t(byArtist), t(byLyrics)]}
                            center={true}
                            searchFilters={searchFilters}
                            onSelectionChange={onSelectionChange}
                        />
                    </View>
                </Surface>
            </Animated.View>
        </View>
    )
}

export default FloatingSearchBar

const styles = StyleSheet.create({
    surface: {
        width: '90%',
        borderRadius: 30,
    },
})
