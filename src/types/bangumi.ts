export interface BangumiUserCollection {
	data: Item[]
	total: number
	limit: number
	offset: number
}

export interface Item {
	updated_at: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 我太懒了！有空替换成 unknown！
	comment: any
	tags: string[]
	subject: Subject
	subject_id: number
	vol_status: number
	ep_status: number
	subject_type: number
	type: number
	rate: number
	private: boolean
}

export interface Subject {
	date: string
	images: Images
	name: string
	name_cn: string
	short_summary: string
	tags: Tag[]
	score: number
	type: number
	id: number
	eps: number
	volumes: number
	collection_total: number
	rank: number
}

export interface Images {
	small: string
	grid: string
	large: string
	medium: string
	common: string
}

export interface Tag {
	name: string
	count: number
}
