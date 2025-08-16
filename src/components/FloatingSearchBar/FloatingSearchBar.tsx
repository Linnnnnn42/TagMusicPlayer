import { colors } from '@/constants/tokens'
import { Searchbar, Surface } from 'react-native-paper'
import { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import RowCheckBox from '@/components/FloatingSearchBar/RowCheckbox'
import * as React from 'react'

type FloatingSearchBarProps = {
    visible?: boolean
    hideOffset?: number
    onSearchChange?: (text: string) => void
    ref?: React.Ref<{ focus: () => void }>
}

const FloatingSearchBar = ({ 
    visible = true, 
    hideOffset = -300, 
    onSearchChange,
    ref 
}: FloatingSearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const animatedValue = useRef(new Animated.Value(visible ? 1 : 0)).current
    const [visibility, setVisibility] = useState(visible)
    const searchbarRef = useRef<any>(null)

    const handleSelectionChange = (selectedItem: string[]) => {
        console.log(selectedItem)
    }

    const handleSearchQueryChange = (text: string) => {
        setSearchQuery(text)
        onSearchChange?.(text)
    }

    React.useImperativeHandle(ref, () => ({
        focus: () => {
            setTimeout(() => {
                searchbarRef.current?.focus()
            }, 100) // Delay to ensure animation completion
        },
    }))

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

    if (!visibility) {
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
                                translateY: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [hideOffset, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Surface style={styles.surface} elevation={4}>
                    <View style={{ width: '100%' }}>
                        <Searchbar
                            ref={searchbarRef}
                            value={searchQuery}
                            placeholder={'Find in songs'}
                            searchAccessibilityLabel={'Find in songs'}
                            mode={'bar'}
                            onChangeText={handleSearchQueryChange}
                            theme={{ colors: { onSurfaceVariant: 'black' } }}
                        />
                        <RowCheckBox
                            items={['Title', 'Artist', 'Lyrics']}
                            center={true}
                            onSelectionChange={handleSelectionChange}
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
