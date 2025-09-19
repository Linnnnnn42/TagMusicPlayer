import { MMKV } from 'react-native-mmkv'
import { dbIds } from '@/database/dbIds'
import { keys } from '@/database/keys'
import { TagFilterState } from '@/hooks/playingTab/useTagFilter'

const envStorage = new MMKV({
    id: dbIds.envStorageId,
})

export function hasLaunched() {
    if (envStorage.contains(keys.HAS_LAUNCHED)) {
        return true
    } else {
        envStorage.set(keys.HAS_LAUNCHED, true)
        return false
    }
}

export function updatePlayingTagStates(tagStates: Record<string, TagFilterState>) {
    envStorage.set(keys.LAST_PLAYING_TAG_STATES, JSON.stringify(tagStates))
}

export function readPlayingTagStates(): Record<string, TagFilterState> | null {
    const str = envStorage.getString(keys.LAST_PLAYING_TAG_STATES)
    if (!str) {
        return null
    }
    return JSON.parse(str) as Record<string, TagFilterState>
}
