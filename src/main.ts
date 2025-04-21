import { ensurePlaceList, getNearbyPlaces, searchPlace } from './utils/placeHelper';
import { NearbyPlace, SearchedPlace } from './types';
import minimist from 'minimist';
import path from 'path';

const args = minimist(process.argv.slice(2));
const currentLat = parseFloat(args.lat) || 24.1572335;
const currentLng = parseFloat(args.lng) || 120.6634857;

(async () => {
    const filePath = path.resolve(__dirname, '../places.json');
    const places = await ensurePlaceList(
        filePath,
    );

    const nearby = getNearbyPlaces(places, currentLat, currentLng);
    //
    if (!nearby) {
        console.log('😢 附近沒有地點');
        return;
    }

    // 串接 Google Map Api 取得連結及相關資訊
    const searchResults = await searchPlace(nearby.name);

    if (searchResults.length > 0) {
        const p: SearchedPlace = searchResults[0];
        console.log('🎯 地點名稱:', p.name);
        console.log('📍 地址:', p.address);
        console.log('🗺️ 地圖連結:', p.map_url);
        console.log('📌 經緯度:', p.location.lat, p.location.lng);
        console.log('📌 差距距離 (公尺):', nearby.distanceInMeters);
    } else {
        console.log('❌ 無法找到地點資訊。');
    }
})();
