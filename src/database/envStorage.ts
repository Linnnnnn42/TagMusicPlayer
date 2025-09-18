import { MMKV } from 'react-native-mmkv'

const envStorage = new MMKV({
    id: 'env-storage',
})

export function hasLaunched() {
    if (envStorage.contains('hasLaunched')) {
        return true
    } else {
        envStorage.set('hasLaunched', true)
        return false
    }
}
