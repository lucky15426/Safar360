// mapHelpers.js
// Replacement: Nominatim (OpenStreetMap) — FREE, no API key
// Docs: https://nominatim.org/release-docs/latest/api/Search/
//
// Rate limit: 1 request/second (we debounce in SearchBar)
// Usage policy: Must include a Referer or User-Agent header

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

/**
 * Geocode a search query → { lat, lng, name, displayName, boundingBox }
 * This replaces Google Geocoding API
 *
 * @param {string} query - Place name, address, or landmark
 * @returns {Object|null} - Location data or null if not found
 */
export const geocode = async (query) => {
    if (!query || query.trim().length === 0) return null;

    try {
        const url = `${NOMINATIM_BASE}/search?` +
            new URLSearchParams({
                q: query.trim(),
                format: "jsonv2",
                limit: "1",
                addressdetails: "1",
                extratags: "1",
                namedetails: "1",
            }).toString();

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": "Safar360-VirtualTour/1.0",
            },
        });

        if (!response.ok) {
            console.warn("Nominatim error:", response.status);
            return null;
        }

        const results = await response.json();

        if (!results || results.length === 0) {
            console.warn("No geocoding results for:", query);
            return null;
        }

        const result = results[0];

        return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            name: result.display_name || query,
            displayName: result.display_name,
            type: result.type,
            category: result.category,
            importance: result.importance,
            boundingBox: result.boundingbox
                ? {
                    south: parseFloat(result.boundingbox[0]),
                    north: parseFloat(result.boundingbox[1]),
                    west: parseFloat(result.boundingbox[2]),
                    east: parseFloat(result.boundingbox[3]),
                }
                : null,
            address: result.address || {},
            osmId: result.osm_id,
            osmType: result.osm_type,
        };
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};

/**
 * Reverse geocode: lat/lng → location data
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {Object|null}
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        const url = `${NOMINATIM_BASE}/reverse?` +
            new URLSearchParams({
                lat: lat.toString(),
                lon: lng.toString(),
                format: "jsonv2",
                addressdetails: "1",
            }).toString();

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": "Safar360-VirtualTour/1.0",
            },
        });

        if (!response.ok) return null;

        const result = await response.json();

        return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            name: result.display_name,
            displayName: result.display_name,
            address: result.address || {},
        };
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @returns {number} Distance in kilometers
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};