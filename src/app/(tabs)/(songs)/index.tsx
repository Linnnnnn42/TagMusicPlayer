import { Text, View } from 'react-native'
import defaultStyle, { songsTabStyles } from '@/styles/style'
import { SongsList } from '@/components/SongsList'
import { SongsHeader } from '@/components/SongsHeader'
import { useState } from 'react'

export default function () {
    const [onlyMusicDir, setOnlyMusicDir] = useState(true)

    return (
        <View style={defaultStyle.container}>
            <SongsHeader onlyMusicDir={onlyMusicDir} setOnlyMusicDir={setOnlyMusicDir} />
            <SongsList />
        </View>
    )
}
