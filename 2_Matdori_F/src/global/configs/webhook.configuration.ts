import { registerAs } from '@nestjs/config';

export default registerAs('webhookConfiguration', () => ({
	webhook: {
		url: process.env.DISCODE_WEBHOOK_URL,
	},
}));
