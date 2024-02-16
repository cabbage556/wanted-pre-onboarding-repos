import { User } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository, Brackets, SelectQueryBuilder } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsQueryDto } from './dto/query-post.dto';
import { OrderRole, orderMappings } from 'src/commons/enums/order-role.enum';
import { SearchRole } from 'src/commons/enums/search-role.enum';
import { StatsQueryDto } from './dto/stats-query.dto';
import { StasticsType } from 'src/commons/enums/stastics-type.enum';
import { stasticsValueType } from 'src/commons/enums/stastics-value-type.enum';

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
	) {}

	async createPost(user: User, createPostDto: CreatePostDto): Promise<Post> {
		const { title, content, hashtags, type } = createPostDto;

		if (Array.isArray(hashtags)) {
			const newPost = this.postRepository.create({
				title,
				content,
				hashtags: [user.account, ...hashtags],
				type,
				user,
			});

			await this.postRepository.save(newPost);
			return newPost;
		} else {
			const newPost = this.postRepository.create({
				title,
				content,
				hashtags: [user.account, hashtags],
				type,
				user,
			});
			await this.postRepository.save(newPost);
			return newPost;
		}
	}

	async findOne(postId: string): Promise<Post | null> {
		return this.postRepository.findOne({ where: { id: postId } });
	}

	async getPost(post: Post): Promise<Post> {
		const viewCount = post.viewCount + 1;
		const result = await this.postRepository.save({ ...post, viewCount });
		return result;
	}

	async getStats(statsQueryDto: StatsQueryDto, user: User) {
		const { value, type, hashtag } = statsQueryDto;
		let { start, end } = statsQueryDto;
		const qb = this.postRepository.createQueryBuilder('post');

		if (!(start && end)) {
			start = new Date();
			start.setDate(start.getDate() - 7);
			end = new Date();
		}

		if (type == StasticsType.DATE) {
			if (value == stasticsValueType.COUNT) {
				qb.select(['DATE_FORMAT(post.createdAt, "%Y-%m-%d") as date', 'COUNT(*) as count']);
				qb.where('post.createdAt >= :start AND post.createdAt <= :end', { start, end });

				if (hashtag) qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', { hashtag });
				else
					qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', {
						hashtag: user.account,
					});

				qb.groupBy('date');

				const result = await qb.getRawMany();

				const stats = result.reduce((acc, item) => {
					acc[item.date] = parseInt(item.count);
					return acc;
				}, {});

				return stats;
			} else {
				qb.select(['DATE_FORMAT(post.createdAt, "%Y-%m-%d") as date', `SUM(${value}) as count`]);
				qb.where('post.createdAt >= :start AND post.createdAt <= :end', { start, end });

				if (hashtag) qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', { hashtag });
				else
					qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', {
						hashtag: user.account,
					});

				qb.groupBy('date');

				const result = await qb.getRawMany();

				const stats = result.reduce((acc, item) => {
					acc[item.date] = parseInt(item.count);
					return acc;
				}, {});

				return stats;
			}
		}

		if (type == StasticsType.HOUR) {
			if (value == stasticsValueType.COUNT) {
				qb.select('DATE_FORMAT(post.createdAt, "%Y-%m-%d %H:%i") AS date, COUNT(*) AS count');
				qb.where('post.createdAt >= :start AND post.createdAt <= :end', { start, end });

				if (hashtag) {
					qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', { hashtag });
				} else {
					qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', {
						hashtag: user.account,
					});
				}

				qb.groupBy('date');

				const result = await qb.getRawMany();

				const stats = result.reduce((acc, item) => {
					acc[item.date] = parseInt(item.count);
					return acc;
				}, {});

				return stats;
			} else {
				qb.select(`DATE_FORMAT(post.createdAt, "%Y-%m-%d %H:%i") AS date, SUM(${value}) AS count`);
				qb.where('post.createdAt >= :start AND post.createdAt <= :end', { start, end });

				if (hashtag) {
					qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', { hashtag });
				} else {
					qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', {
						hashtag: user.account,
					});
				}

				qb.groupBy('date');

				const result = await qb.getRawMany();

				const stats = result.reduce((acc, item) => {
					acc[item.date] = parseInt(item.count);
					return acc;
				}, {});

				return stats;
			}
		}
	}

	async like(post: Post) {
		await this.postRepository.update(post.id, { likeCount: post.likeCount + 1 });
	}

	async share(post: Post) {
		await this.postRepository.update(post.id, { shareCount: post.shareCount + 1 });
	}

	async paginateQuery(query: SelectQueryBuilder<Post>, page: number, pageCount: number): Promise<Post[]> {
		const skip = page * pageCount;
		const posts = await query.skip(skip).take(pageCount).getMany();
		return posts;
	}

	addHashtag(qb: SelectQueryBuilder<Post>, hashtag: string, account: string) {
		if (hashtag) {
			const jsonHashtag = JSON.stringify(hashtag);
			qb.where('JSON_CONTAINS(post.hashtags, :hashtag) = 1', { hashtag: jsonHashtag });
		} else {
			qb.andWhere('JSON_CONTAINS(post.hashtags, JSON_QUOTE(:hashtag)) = 1', { hashtag: account });
		}
	}

	addOrder(qb: SelectQueryBuilder<Post>, orderBy: OrderRole, order: 'asc' | 'desc') {
		const orderColumn = orderMappings[orderBy];
		if (orderColumn) qb.orderBy(`post.${orderColumn}`, order === 'asc' ? 'ASC' : 'DESC');
	}

	addType(qb: SelectQueryBuilder<Post>, type: string) {
		if (type) qb.andWhere('post.type = :type', { type: type });
	}

	addSearch(qb: SelectQueryBuilder<Post>, searchBy: SearchRole, search: string) {
		if (search) {
			if (!searchBy || searchBy === SearchRole.titleContent) {
				qb.andWhere(
					new Brackets((subQuery) => {
						subQuery
							.where('post.title LIKE :search', { search: `%${search}%` })
							.orWhere('post.content LIKE :search', { search: `%${search}%` });
					}),
				);
			} else {
				qb.andWhere(`post.${SearchRole[searchBy]} LIKE :search`, { search: `%${search}%` });
			}
		}
	}

	async findPosts(query: PostsQueryDto, account: string) {
		const { type, hashtag, orderBy, order, search, searchBy } = query;

		let { page, pageCount } = query;
		page = page || 0;
		pageCount = pageCount || 10;

		const qb = this.postRepository.createQueryBuilder('post');

		this.addHashtag(qb, hashtag, account);
		this.addOrder(qb, orderBy, order);
		this.addType(qb, type);
		this.addSearch(qb, searchBy, search);

		const posts = await this.paginateQuery(qb, page, pageCount);

		const resultPosts = posts.map((post) => {
			if (post.content.length > 20) post.content = post.content.substring(0, 20) + '...';

			return post;
		});

		const response = {
			posts: resultPosts,
			postCount: resultPosts.length,
			pageCount: pageCount,
			page: page,
		};

		return response;
	}
}
