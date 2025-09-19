import { MMKV } from 'react-native-mmkv'
import { dbIds } from '@/database/dbIds'
import { keys } from '@/database/keys'

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

export function updatePlayingSelectedTags(newSelected: Set<string>) {
    envStorage.set(keys.LAST_PLAYING_SELECTED_TAGS, JSON.stringify(Array.from(newSelected)))
}

export function readPlayingSelectedTags() {
    const str = envStorage.getString(keys.LAST_PLAYING_SELECTED_TAGS)
    if (!str) {
        return null
    }
    return new Set<string>(JSON.parse(str) as string[])
}
