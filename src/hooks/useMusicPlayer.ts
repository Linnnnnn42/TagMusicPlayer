import { useEffect, useState } from 'react'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { useAudioPlayer } from 'expo-audio'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { GlobalMusicPlayerContextType } from '@/app/_layout'

const useMusicPlayer = (mediaLibrary: GlobalMusicPlayerContextType['mediaLibrary']) => {
    // Get Data
    // const mediaLibrary = useGetMediaLibrary()
    const { minimalMusicInfoList } = { ...mediaLibrary }

    // Player
    const [songInfoPlaying, setSongInfoPlaying] = useState<MinimalMusicInfo>({
        id: '',
        title: '',
        artist: undefined,
        cover: undefined,
        lyrics: undefined,
        allLyricsLines: undefined,
        filename: '',
        uri: '',
    })
    const [songIdPlaying, setSongIdPlaying] = useState<string>('')
    const handleSongChange = (songId: string) => {
        setSongIdPlaying(songId)
        const minimalSongInfo = minimalMusicInfoList.find((song) => song.id === songId)
        if (minimalSongInfo) {
            setSongInfoPlaying(minimalSongInfo)
        }
    }
    const player = useAudioPlayer(songInfoPlaying.uri)
    useEffect(() => {
        player.play()
    }, [songInfoPlaying])

    return {
        songIdPlaying,
        songInfoPlaying,
        handleSongChange,
    }
}

export default useMusicPlayer
