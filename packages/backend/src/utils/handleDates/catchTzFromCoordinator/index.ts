import GeoTz from "geo-tz";


const geoTimezone = (lat: number, long: number) => GeoTz.find(lat,long)

export {geoTimezone}