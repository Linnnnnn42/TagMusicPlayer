// src/hooks/useGlobalMusicPlayer.ts
import { useContext } from 'react'
import { globalMusicPlayerContext } from '@/app/_layout'
import type { GlobalMusicPlayerContextType } from '@/app/_layout'

export default function useGlobalMusicPlayer(): GlobalMusicPlayerContextType {
    const context = useContext(globalMusicPlayerContext)

    if (!context) {
        throw new Error('useGlobalMusicPlayer must be used within a Provider')
    }

    return context
}
