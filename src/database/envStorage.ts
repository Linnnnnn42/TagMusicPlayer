import { MMKV } from 'react-native-mmkv'
import { dbIds } from '@/database/dbIds'

const envStorage = new MMKV({
    id: dbIds.envStorageId,
})

export function hasLaunched() {
    if (envStorage.contains('hasLaunched')) {
        return true
    } else {
        envStorage.set('hasLaunched', true)
        return false
    }
}
