export enum OrderRole {
	createdAt = 'created_at',
	updatedAt = 'updated_at',
	likeCount = 'like_count',
	shareCount = 'share_count',
	viewCount = 'view_count',
}

export const orderMappings: Record<OrderRole, string> = {
	[OrderRole.createdAt]: 'createdAt',
	[OrderRole.updatedAt]: 'updatedAt',
	[OrderRole.likeCount]: 'likeCount',
	[OrderRole.shareCount]: 'shareCount',
	[OrderRole.viewCount]: 'viewCount',
};
