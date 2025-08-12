import { Tabs } from 'expo-router'
import { colors } from '@/constants/tokens'

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name={'playlists'} />
            <Tabs.Screen name={'tags'} />
            <Tabs.Screen name={'favorites'} />
            <Tabs.Screen name={'(songs)'} />
        </Tabs>
    )
}
