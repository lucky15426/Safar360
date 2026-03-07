import axios from "axios";

/* ── Nominatim-based place search (no API key needed) ──────── */

class PlacesService {
    async getPredictions(query) {
        if (!query || query.trim().length < 2) return [];
        try {
            const res = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: query,
                    format: "json",
                    limit: 5,
                    addressdetails: 1,
                },
                headers: { "Accept-Language": "en" },
            });
            return (res.data || []).map((item) => ({
                place_id: item.place_id,
                description: item.display_name,
                structured_formatting: {
                    main_text: item.name || item.display_name.split(",")[0],
                    secondary_text: item.display_name.split(",").slice(1).join(",").trim(),
                },
            }));
        } catch {
            return [];
        }
    }
}

export const placesService = new PlacesService();
