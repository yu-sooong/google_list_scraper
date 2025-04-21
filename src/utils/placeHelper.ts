import fs from 'fs';
import axios from 'axios';
import { Place, NearbyPlace, SearchedPlace } from '../types';
import { parseGoogleListRes } from './parseGoogleListRes';
import * as dotenv from "dotenv";

dotenv.config();

/**
 * 取得地點資料
 * @param filePath
 */
export async function ensurePlaceList(filePath: string): Promise<Place[]> {
    if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    }
    const res = await axios.get(process.env.GOOGLE_LIST_URL || 'https://www.google.com.tw/maps/preview/entitylist/getlist?authuser=1&hl=zh-TW&gl=tw&authuser=1&pb=', {
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Mozilla/5.0',
        },
    });

    const rawText = Buffer.from(res.data).toString();
    const jsonText = rawText.replace(/\)\]\}'/, '');
    const parsed = JSON.parse(jsonText);
    const places = parseGoogleListRes(parsed);

    fs.writeFileSync(filePath, JSON.stringify(places, null, 2), 'utf-8');
    return places;
}

/**
 * 兩地距離
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 */
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * 取得最近的地點（隨機選一個)
 *
 * @param places
 * @param lat
 * @param lng
 * @param maxDistanceMeters
 */
export function getNearbyPlaces(
    places: Place[],
    lat: number,
    lng: number,
    maxDistanceMeters = 1000 * 5 // 預設五公里內
): NearbyPlace | null {
    const enriched = places
        .map(place => {
            const distance = getDistance(lat, lng, place.lat, place.lng);
            return {
                ...place,
                distance,
                distanceInMeters: Math.round(distance * 1000),
            };
        })
        .filter(p => p.distanceInMeters <= maxDistanceMeters)
        .sort((a, b) => a.distanceInMeters - b.distanceInMeters);

    if (enriched.length === 0) return null;
    const top3 = enriched.slice(0, 3);
    return top3[Math.floor(Math.random() * top3.length)];
}

/**
 * Google Maps 查詢地點 (串接 Google map api)
 * @param query
 */
export async function searchPlace(query: string): Promise<SearchedPlace[]> {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const res = await axios.get(url, {
        params: {
            query,
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: 'zh-TW',
            region: 'tw',
        },
    });

    return res.data.results.map((place: any) => ({
        name: place.name,
        address: place.formatted_address,
        location: place.geometry.location,
        place_id: place.place_id,
        map_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }));
}
