// placesService.js
// Replacement: Photon API (by Komoot) — FREE, no API key, uses OpenStreetMap
// Docs: https://photon.komoot.io/

const PHOTON_BASE = "https://photon.komoot.io/api";

/**
 * Get place autocomplete predictions using Photon (OSM-based)
 * This replaces Google Places Autocomplete
 *
 * @param {string} query - User's search text
 * @param {number} limit - Max results (default 6)
 * @returns {Array} - Array of prediction objects matching Google's format
 */
const getPredictions = async (query, limit = 6) => {
    if (!query || query.trim().length < 2) return [];

    try {
        const url = `${PHOTON_BASE}?q=${encodeURIComponent(query.trim())}&limit=${limit}&lang=en`;

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            console.warn("Photon API error:", response.status);
            return [];
        }

        const data = await response.json();

        if (!data.features || data.features.length === 0) return [];

        // Transform Photon response to match Google Places format
        // so SearchBar.jsx doesn't need any changes
        return data.features.map((feature, index) => {
            const props = feature.properties || {};
            const coords = feature.geometry?.coordinates || [0, 0]; // [lng, lat]

            // Build a readable description
            const nameParts = [];
            if (props.name) nameParts.push(props.name);
            if (props.street) nameParts.push(props.street);
            if (props.city || props.town || props.village) {
                nameParts.push(props.city || props.town || props.village);
            }
            if (props.state) nameParts.push(props.state);
            if (props.country) nameParts.push(props.country);

            const description =
                nameParts.length > 0 ? nameParts.join(", ") : "Unknown Location";

            // Main text = place name or first part
            const mainText = props.name || props.street || props.city || description.split(",")[0];

            // Secondary text = everything after main
            const secondaryText = nameParts.slice(1).join(", ") || props.country || "";

            return {
                place_id: `photon_${props.osm_id || index}_${index}`,
                description: description,
                structured_formatting: {
                    main_text: mainText,
                    secondary_text: secondaryText,
                },
                // Extra data for direct geocoding (avoids separate geocode call)
                _coords: {
                    lat: coords[1],
                    lng: coords[0],
                },
                _properties: props,
            };
        });
    } catch (error) {
        console.error("Photon autocomplete error:", error);
        return [];
    }
};

/**
 * Reverse geocode: lat/lng → address string
 * Uses Photon reverse endpoint
 */
const reverseGeocode = async (lat, lng) => {
    try {
        const url = `${PHOTON_BASE}/reverse?lat=${lat}&lon=${lng}&limit=1&lang=en`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            const parts = [];
            if (props.name) parts.push(props.name);
            if (props.city || props.town) parts.push(props.city || props.town);
            if (props.country) parts.push(props.country);
            return parts.join(", ") || "Unknown Location";
        }

        return "Unknown Location";
    } catch (error) {
        console.error("Reverse geocode error:", error);
        return "Unknown Location";
    }
};

export const placesService = {
    getPredictions,
    reverseGeocode,
};