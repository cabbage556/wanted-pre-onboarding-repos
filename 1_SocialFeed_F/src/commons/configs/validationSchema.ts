import * as Joi from 'joi';

export const validationSchema = Joi.object({
	// SERVER
	SERVER_PORT: Joi.number().required(),

	// MYSQL
	MYSQL_ROOT_USER: Joi.string().required(),
	MYSQL_ROOT_PASSWORD: Joi.string().required(),
	MYSQL_HOST: Joi.string().required(),
	MYSQL_PORT: Joi.number().required(),
	MYSQL_DATABASE: Joi.string().required(),
	MYSQL_SYNCHRONIZE: Joi.boolean().required(),
	MYSQL_LOGGING: Joi.boolean().required(),

	// JWT
	JWT_ACCESS_SECRET_KEY: Joi.string().required(),
	JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
	JWT_REFRESH_SECRET_KEY: Joi.string().required(),
	JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
});
