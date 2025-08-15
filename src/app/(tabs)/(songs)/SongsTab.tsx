import { Text, View } from 'react-native'
import defaultStyle, { songsTabStyles } from '@/styles/style'
import { SongsList } from '@/components/SongsList'

export default function () {
    return (
        <View style={defaultStyle.container}>
            <View style={songsTabStyles.header}>
                <Text style={songsTabStyles.title}>Songs @ Music Lib</Text>
            </View>
            <SongsList />
        </View>
    )
}
