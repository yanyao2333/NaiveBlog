/**
 * 表示一个备忘录列表的响应。
 */
export interface MemoListResponse {
	memos: Memo[]
	nextPageToken: string
}

/**
 * 表示一个备忘录。
 */
export interface Memo {
	// 备忘录的名称，格式为 memos/{id}，id 是系统生成的唯一标识符。
	name: string
	// 用户定义的备忘录 ID。
	uid: string
	// 备忘录的行状态。
	rowStatus: 'ROW_STATUS_UNSPECIFIED' | 'ACTIVE' | 'ARCHIVED'
	// 创建者的名称，格式为 users/{id}。
	creator: string
	// 创建时间，格式为 date-time。
	createTime: string
	// 更新时间，格式为 date-time。
	updateTime: string
	// 显示时间，格式为 date-time。
	displayTime: string
	// 备忘录的内容。
	content: string
	// 备忘录的节点列表(不重要)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 我太懒了！有空替换成 unknown！
	nodes: any[]
	// 备忘录的可见性。
	visibility: 'VISIBILITY_UNSPECIFIED' | 'PRIVATE' | 'PROTECTED' | 'PUBLIC'
	// 备忘录的标签列表。
	tags: string[]
	// 是否固定。
	pinned: boolean
	// 父备忘录的 ID，只读。
	parentId?: number
	// 备忘录的资源列表，只读。
	resources: Resource[]
	// 备忘录的关系列表，只读。
	relations: Relation[]
	// 备忘录的反应列表，只读。
	reactions: Reaction[]
	// 备忘录的属性，只读。
	property: Property
	// 父备忘录的名称，格式为 memos/{id}，只读。
	parent?: string
	// 备忘录内容的片段，纯文本。
	snippet: string
	// 使用remark html解析后的内容。只存在于显示页面处理后，原始请求没有
	parsedContent?: string
}

/**
 * 资源对象。
 */
interface Resource {
	/**
	 * 描述：资源的名称。
	 * 格式：resources/{id}
	 * id 是系统生成的唯一标识符。
	 */
	name: string

	/**
	 * 描述：用户定义的资源 ID。
	 */
	uid: string

	/**
	 * 描述：创建时间。
	 * 格式：日期时间
	 * 只读
	 */
	createTime: string

	/**
	 * 描述：文件名。
	 */
	filename: string

	/**
	 * 描述：资源内容。
	 * 格式：字节
	 */
	content: string

	/**
	 * 描述：外部链接。
	 */
	externalLink: string

	/**
	 * 描述：资源类型。
	 */
	type: string

	/**
	 * 描述：资源大小。
	 * 格式：int64
	 */
	size: string

	/**
	 * 描述：相关的备忘录。
	 * 格式：memos/{id}
	 */
	memo: string
}

/**
 * 描述：关系对象。
 */
interface Relation {
	/**
	 * 描述：备忘录的名称。
	 * 格式：memos/{uid}
	 */
	memo: string

	/**
	 * 描述：相关备忘录的名称。
	 * 格式：memos/{uid}
	 */
	relatedMemo: string

	/**
	 * 描述：关系的类型。
	 * 默认值：TYPE_UNSPECIFIED
	 */
	type: 'TYPE_UNSPECIFIED' | 'REFERENCE' | 'COMMENT'
}

/**
 * 描述：反应对象。
 */
interface Reaction {
	/**
	 * 描述：反应的 ID。
	 * 格式：int32
	 */
	id: number

	/**
	 * 描述：创建者的名称。
	 * 格式：users/{id}
	 */
	creator: string

	/**
	 * 描述：内容 ID。
	 */
	contentId: string

	/**
	 * 描述：反应类型。
	 * 默认值：TYPE_UNSPECIFIED
	 */
	reactionType:
		| 'TYPE_UNSPECIFIED'
		| 'THUMBS_UP'
		| 'THUMBS_DOWN'
		| 'HEART'
		| 'FIRE'
		| 'CLAPPING_HANDS'
		| 'LAUGH'
		| 'OK_HAND'
		| 'ROCKET'
		| 'EYES'
		| 'THINKING_FACE'
		| 'CLOWN_FACE'
		| 'QUESTION_MARK'
}

/**
 * 描述：属性对象。
 */
interface Property {
	/**
	 * 描述：标签列表。
	 */
	tags: string[]

	/**
	 * 描述：是否有链接。
	 */
	hasLink: boolean

	/**
	 * 描述：是否有任务列表。
	 */
	hasTaskList: boolean

	/**
	 * 描述：是否有代码。
	 */
	hasCode: boolean

	/**
	 * 描述：是否有未完成的任务。
	 */
	hasIncompleteTasks: boolean
}
