import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function AppLayout() {
    return (
        <SafeAreaProvider>
            <RootNavigation />

            <StatusBar style={'dark'} />
        </SafeAreaProvider>
    )
}

const RootNavigation = () => {
    return (
        <Stack>
            {/*Tabs*/}
            <Stack.Screen name={'(tabs)'} options={{ headerShown: false }} />
        </Stack>
    )
}
