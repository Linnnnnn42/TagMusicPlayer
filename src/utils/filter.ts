const searchFilter = (songs: any[], searchContent: string, searchFilters: string[]) => {
    let filteredSongList = [...songs] // Make a copy of the song list

    // console.log(searchFilters, searchContent, filteredSongList.length)

    // If content exists
    if (searchContent) {
        filteredSongList = filteredSongList.filter((song) => {
            // Check each filter and return true for any match
            return searchFilters.some((filter) => {
                switch (filter) {
                    case 'Title':
                        return songTitleFilter(searchContent)(song)
                    case 'Artist':
                        return songArtistFilter(searchContent)(song)
                    case 'Lyrics':
                        return songLyricsFilter(searchContent)(song)
                    default:
                        return false
                }
            })
        })
    }

    return filteredSongList
}

export const songTitleFilter = (titleSearched: string) => (song: any) => {
    return song.title?.toLowerCase().includes(titleSearched.toLowerCase())
}

export const songArtistFilter = (artistSearched: string) => (song: any) => {
    return song.artist?.toLowerCase().includes(artistSearched.toLowerCase())
}

export const songLyricsFilter = (lyricsSearched: string) => (song: any) => {
    return song.allLyricsLines?.toLowerCase().includes(lyricsSearched.toLowerCase())
    // Need to remove all timestamps here
}

export default searchFilter
