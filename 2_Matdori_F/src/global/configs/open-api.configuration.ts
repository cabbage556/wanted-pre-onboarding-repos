import { registerAs } from '@nestjs/config';

export default registerAs('openApiConfiguration', () => ({
	japanese: {
		url: process.env.OPEN_API_JAPANESE_FOOD_URL,
		key: process.env.JAPANESE_FOOD_AUTH_KEY,
		requestUrl:
			process.env.OPEN_API_JAPANESE_FOOD_URL + '?KEY=' + process.env.JAPANESE_FOOD_AUTH_KEY + '&type=json',
	},

	chinese: {
		url: process.env.OPEN_API_CHINESE_FOOD_URL,
		key: process.env.CHINESE_FOOD_AUTH_KEY,
		requestUrl: process.env.OPEN_API_CHINESE_FOOD_URL + '?KEY=' + process.env.CHINESE_FOOD_AUTH_KEY + '&type=json',
	},

	korean: {
		url: process.env.OPEN_API_KOREAN_FOOD_URL,
		key: process.env.KOREAN_FOOD_AUTH_KEY,
		requestUrl: process.env.OPEN_API_KOREAN_FOOD_URL + '?KEY=' + process.env.KOREAN_FOOD_AUTH_KEY + '&type=json',
	},
}));
