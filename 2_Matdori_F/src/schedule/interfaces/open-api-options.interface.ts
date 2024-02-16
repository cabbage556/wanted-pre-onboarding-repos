import { Category } from 'src/global/enums/category.enum';

export interface OpenApiOptions {
	pageIndex: number;
	pagePerRow: number;
	sigunName?: string;
	sigunCode?: string;
	type: Category.CHINESE | Category.JAPANESE | Category.KOREAN;
}
