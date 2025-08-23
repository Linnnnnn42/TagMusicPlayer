import { useEffect, useState } from 'react'
import { MinimalMusicInfo } from '@/utils/getMediaLibraryMMKV'
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio'
import useGetMediaLibrary from '@/hooks/useGetMediaLibrary'

const useGetMusicPlayer = (mediaLibrary: ReturnType<typeof useGetMediaLibrary>) => {
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
    const [previousSongId, setPreviousSongId] = useState<string | undefined>(undefined)
    const [nextSongId, setNextSongId] = useState<string | undefined>(undefined)
    
    const handleSongChange = (songId: string) => {
        setSongIdPlaying(songId)
        const minimalSongInfo = minimalMusicInfoList.find((song) => song.id === songId)
        if (minimalSongInfo) {
            setSongInfoPlaying(minimalSongInfo)
            
            // Find previous and next song IDs
            const currentIndex = minimalMusicInfoList.findIndex((song) => song.id === songId)
            if (currentIndex !== -1) {
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : undefined
                const nextIndex = currentIndex < minimalMusicInfoList.length - 1 ? currentIndex + 1 : undefined
                
                setPreviousSongId(prevIndex !== undefined ? minimalMusicInfoList[prevIndex].id : undefined)
                setNextSongId(nextIndex !== undefined ? minimalMusicInfoList[nextIndex].id : undefined)
            } else {
                setPreviousSongId(undefined)
                setNextSongId(undefined)
            }
        }
    }

    // audio mode setting
    const playerModeSetter = setAudioModeAsync

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
        playerModeSetter,
        playerStatus,
        player,
        previousSongId,
        nextSongId,
    }
}

export default useGetMusicPlayer
