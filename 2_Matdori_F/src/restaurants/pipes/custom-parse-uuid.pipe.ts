import { ArgumentMetadata, ParseUUIDPipe } from '@nestjs/common';
import { RestaurantException } from '../enums/restaurant-exception.enum';

export class CustomParseUUIDPipe extends ParseUUIDPipe {
	async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
		try {
			return await super.transform(value, metadata);
		} catch {
			throw this.exceptionFactory(RestaurantException.INVALID_ID);
		}
	}
}
