import { AudioPlayer, AudioStatus } from 'expo-audio'

export function playPauseButtonHandler(
    playerStatus: AudioStatus | undefined,
    player: AudioPlayer | undefined,
) {
    if (playerStatus?.playing === true) {
        player?.pause()
    } else {
        if (
            playerStatus &&
            playerStatus.currentTime !== undefined &&
            playerStatus.duration !== undefined &&
            playerStatus.isLoaded &&
            playerStatus.currentTime >= playerStatus.duration
        ) {
            player?.seekTo(0)
            player?.play()
        } else {
            player?.play()
        }
    }
}
