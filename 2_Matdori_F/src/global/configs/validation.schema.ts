import * as Joi from 'joi';

export const validationSchema = Joi.object({
	// SERVER
	SERVER_PORT: Joi.number().required(),

	// POSTGRESQL
	POSTGRESQL_USER: Joi.string().required(),
	POSTGRESQL_PASSWORD: Joi.string().required(),
	POSTGRESQL_HOST: Joi.string().required(),
	POSTGRESQL_PORT: Joi.number().required(),
	POSTGRESQL_DATABASE: Joi.string().required(),
	POSTGRESQL_SYNCHRONIZE: Joi.boolean().required(),
	POSTGRESQL_LOGGING: Joi.boolean().required(),

	// JWT
	JWT_ACCESS_SECRET_KEY: Joi.string().required(),
	JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
	JWT_REFRESH_SECRET_KEY: Joi.string().required(),
	JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),

	// OPEN API
	OPEN_API_JAPANESE_FOOD_URL: Joi.string().required(),
	OPEN_API_CHINESE_FOOD_URL: Joi.string().required(),
	OPEN_API_KOREAN_FOOD_URL: Joi.string().required(),

	JAPANESE_FOOD_AUTH_KEY: Joi.string().required(),
	CHINESE_FOOD_AUTH_KEY: Joi.string().required(),
	KOREAN_FOOD_AUTH_KEY: Joi.string().required(),

	// REDIS
	REDIS_PORT: Joi.number().required(),
	REDIS_INSIGHT_PORT: Joi.number().required(),

	//WEBHOOK
	DISCODE_WEBHOOK_URL: Joi.string().required(),
});
