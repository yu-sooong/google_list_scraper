export type Place = {
    name: string;
    address: string;
    lat: number;
    lng: number;
};

export type NearbyPlace = Place & {
    distance: number; // 單位：公里
    distanceInMeters: number; // 單位：公尺
};

export type SearchedPlace = {
    name: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    place_id: string;
    map_url: string;
};
