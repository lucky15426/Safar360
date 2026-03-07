import axios from "axios";

export const GMAPS_KEY = "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";

export const geocode = async (q) => {
    try {
        const r = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q, format: "json", limit: 1, addressdetails: 1 },
        });
        if (r.data?.length) {
            const d = r.data[0];
            return { name: d.display_name || q, lat: parseFloat(d.lat), lng: parseFloat(d.lon) };
        }
        return null;
    } catch (error) {
        console.error("Geocoding failed:", error);
        return null;
    }
};
