import { Tabs } from 'expo-router'
import { colors, fontSize, fontWeight } from '@/constants/tokens'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, type ViewProps } from 'react-native'

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

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                // tabBarActiveBackgroundColor: colors.secondary,
                tabBarLabelStyle: {
                    fontSize: fontSize.xs,
                    fontWeight: fontWeight.bold,
                },
                tabBarStyle: {
                    paddingHorizontal: 10,
                    height: 60,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name={'playlists'}
                options={{
                    title: 'Playlists',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="playlist-music" size={24} color={color} />
                    ),
                    tabBarButton: TabBarButton,
                }}
            />
            <Tabs.Screen
                name={'tags'}
                options={{
                    title: 'Tags',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="tag-multiple" size={24} color={color} />
                    ),
                    tabBarButton: TabBarButton,
                }}
            />
            <Tabs.Screen
                name={'favorites'}
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="heart" size={23} color={color} />
                    ),
                    tabBarButton: TabBarButton,
                }}
            />
            <Tabs.Screen
                name={'(songs)'}
                options={{
                    title: 'Songs',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music-box-multiple" size={23} color={color} />
                    ),
                    tabBarButton: TabBarButton,
                }}
            />
        </Tabs>
    )
}
