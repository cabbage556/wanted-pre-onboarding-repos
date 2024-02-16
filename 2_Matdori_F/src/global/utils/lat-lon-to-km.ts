import { LatLonToKm } from '../interfaces/lat-lon-to-km.interface';

export function latLonToKm({ point1, point2 }: LatLonToKm): number {
	const [lon1, lat1] = point1;
	const [lon2, lat2] = point2;

	const R = 6371; // km
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const radLat1 = toRadians(lat1);
	const radLat2 = toRadians(lat2);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

function toRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}
