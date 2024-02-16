import { IsNotEmpty, IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class LocationDto {
	@IsNumber()
	@IsLatitude({ message: 'lat 필드에 유효한 위도를 입력해야 합니다.' })
	@IsNotEmpty({ message: 'lat 필드는 필수 입력 필드입니다.' })
	lat: number; // 위도

	@IsNumber()
	@IsLongitude({ message: 'lon 필드에 유효한 경도를 입력해야 합니다.' })
	@IsNotEmpty({ message: 'lon 필드는 필수 입력 필드입니다.' })
	lon: number; //경도
}
