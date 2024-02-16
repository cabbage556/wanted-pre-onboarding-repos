import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async set(key: string, value: string, ttl: number) {
		return await this.cacheManager.set(key, value, ttl);
	}

	async get(key: string) {
		return await this.cacheManager.get(key);
	}

	async del(key: string) {
		return await this.cacheManager.del(key);
	}

	// TODO: 사용하는 키 구조가 확정되면 pattern을 type으로 따로 빼기
	async findKeys(pattern: string) {
		return await this.cacheManager.store.keys(pattern);
	}
}
