// Cache keys for MMKV storage
export const keys = {
    // New method keys - per-song storage with index
    SONG_PREFIX: 'song_',
    SONG_INDEX_KEY: 'song_index',
    MINIMAL_SONG_PREFIX: 'minimal_song_',
    MINIMAL_SONG_INDEX_KEY: 'minimal_song_index',

    // Tag_{Name}_Song keys - Store songs included in the tag
    TAG_SONG_PREFIX: 'tag_',
    TAG_SONG_SUFFIX: '_song',
    TAG_SONG_INDEX_KEY: 'tag_song_index',

    // Song_{Name}_Tag keys - Store tags attached to the song
    SONG_TAG_PREFIX: 'song_',
    SONG_TAG_SUFFIX: '_tag',
}
