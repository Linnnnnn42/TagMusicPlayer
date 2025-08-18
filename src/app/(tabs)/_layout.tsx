import { Tabs } from 'expo-router'
import { colors, fontSize, fontWeight, tabIcons } from '@/constants/tokens'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, Text, type ViewProps } from 'react-native'
import FloatingPlayer from '@/components/FloatingPlayer/FloatingPlayer'

// Component for ripple effect on Android with customizable ripple color
const TabBarButton = ({
    rippleColor = colors.primaryOpacity30,
    ...props
}: ViewProps & { rippleColor?: string }) => (
    <Pressable
        {...props}
        android_ripple={{
            color: rippleColor,
            borderless: true,
        }}
    />
)

// tabBar config
const tabScreens = [
    {
        name: '(playlists)',
        title: 'Playlists',
        icon: {
            name: tabIcons.playlists as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 29,
        },
    },
    {
        name: 'tags',
        title: 'Tags',
        icon: {
            name: tabIcons.tags as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 28,
        },
    },
    {
        name: 'favorites',
        title: 'Favorites',
        icon: {
            name: tabIcons.favorites as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 26,
        },
    },
    {
        name: 'songs',
        title: 'Songs',
        icon: {
            name: tabIcons.songs as keyof typeof MaterialCommunityIcons.glyphMap,
            size: 28,
        },
    },
] as const

export default function TabsLayout() {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarLabelStyle: {
                        fontSize: fontSize.xxs,
                        fontWeight: fontWeight.bold,
                    },
                    tabBarStyle: {
                        paddingHorizontal: 10,
                        height: 60,
                    },
                    headerShown: false,
                }}
            >
                {tabScreens.map((screen) => (
                    <Tabs.Screen
                        key={screen.name}
                        name={screen.name}
                        options={{
                            title: screen.title,
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons
                                    name={screen.icon.name}
                                    size={screen.icon.size}
                                    color={color}
                                />
                            ),
                            tabBarButton: TabBarButton,
                        }}
                    />
                ))}
            </Tabs>
            <FloatingPlayer />
        </>
    )
}
