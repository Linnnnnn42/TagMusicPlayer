import { useEffect, useState } from 'react'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'
import { GlobalMusicPlayerContextType } from '@/app/_layout'

const useMusicPlayer = (mediaLibrary: GlobalMusicPlayerContextType['mediaLibrary']) => {
    // Get Data
    // const mediaLibrary = useGetMediaLibrary()
    const { minimalMusicInfoList } = { ...mediaLibrary }

    // song playing
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

    // player
    const player = useAudioPlayer(songInfoPlaying.uri)
    useEffect(() => {
        player.play()
    }, [songInfoPlaying])

    // player status
    const playerStatus = useAudioPlayerStatus(player)

    return {
        songIdPlaying,
        songInfoPlaying,
        handleSongChange,
        playerStatus,
        player,
    }
}

export default useMusicPlayer
