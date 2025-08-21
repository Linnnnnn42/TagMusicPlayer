import { useState, useEffect } from 'react'
import { Animated, Platform } from 'react-native'
import BootSplash from 'react-native-bootsplash'

const useNativeDriver = Platform.OS !== 'web'

type Props = {
    onAnimationEnd: () => void
    shouldHide?: boolean // New prop to control whether the splash screen should be hidden
}

export const AnimatedBootSplash = ({ onAnimationEnd, shouldHide = false }: Props) => {
    const [opacity] = useState(() => new Animated.Value(1))
    const [scale] = useState(() => new Animated.Value(1))

    // Handle hide logic
    useEffect(() => {
        if (shouldHide) {
            // Execute hide animation
            Animated.timing(scale, {
                useNativeDriver,
                toValue: 2,
                duration: 1200,
                delay: 0,
            }).start()

            Animated.timing(opacity, {
                useNativeDriver,
                toValue: 0,
                duration: 400,
                delay: 800,
            }).start(() => {
                onAnimationEnd()
            })
        }
    }, [shouldHide])

    // Loop animation logic (when should not hide)
    useEffect(() => {
        let animation: Animated.CompositeAnimation | null = null

        if (!shouldHide) {
            // Create loop animation - scale in and out
            const pulseAnimation = () => {
                animation = Animated.sequence([
                    Animated.timing(scale, {
                        useNativeDriver,
                        toValue: 1.2,
                        duration: 1000,
                    }),
                    Animated.timing(scale, {
                        useNativeDriver,
                        toValue: 1,
                        duration: 1000,
                    }),
                ])

                animation.start(({ finished }) => {
                    // If animation completes and still should not hide, continue looping
                    if (finished && !shouldHide) {
                        pulseAnimation()
                    }
                })
            }

            pulseAnimation()
        }

        // Cleanup function
        return () => {
            if (animation) {
                animation.stop()
            }
        }
    }, [shouldHide])

    const { container, logo /*, brand */ } = BootSplash.useHideAnimation({
        manifest: require('../../assets/bootsplash/manifest.json'),
        logo: require('../../assets/bootsplash/logo.png'),
        animate: () => {
            // No actual animation logic is needed here as we handle it in the useEffect above
            // But this function must exist to satisfy type requirements
        },
    })

    return (
        <Animated.View {...container} style={[container.style, { opacity }]}>
            <Animated.Image
                {...logo}
                style={[
                    logo.style,
                    {
                        transform: [{ scale }],
                    },
                ]}
            />

            <Animated.Text
                style={{
                    transform: [{ scale }],
                    opacity,
                    marginTop: 120,
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#000',
                }}
            >
                {`Loading...`}
            </Animated.Text>
        </Animated.View>
    )
}
