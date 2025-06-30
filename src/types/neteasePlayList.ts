export interface PlayList {
	message: string
	refreshTimestamp?: number
	result: PlayListMain
	code: number
}

interface PlayListMain {
	tracks: Track[]
}

interface Track {
	name: string
	artists: Artist[]
	album: Album
}

interface Artist {
	name: string
}

interface Album {
	picUrl: string
}
