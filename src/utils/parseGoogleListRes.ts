import { Place } from '../types';

export function parseGoogleListRes(data: any): Place[] {
    const rawList = data?.[0]?.[8] || [];

    return rawList
        .map((item: any): Place | null => {
            const name = item?.[2];
            const address = item?.[1]?.[4] || item?.[1]?.[2];
            const lat = item?.[1]?.[5]?.[2];
            const lng = item?.[1]?.[5]?.[3];

            if (!name || !lat || !lng) return null;
            return {
                name,
                address,
                lat,
                lng,
            };
        })
        .filter((p: Place): p is Place => p !== null);
}
