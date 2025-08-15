export const songTitleFilter = (title: string) => (song: any) => {
    return song.title?.toLowerCase().includes(title.toLowerCase())
}
