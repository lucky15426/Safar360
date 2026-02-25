
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1/search';

// Cache to prevent excessive API calls
const imageCache = {};

/**
 * Fetches images from Pexels API based on a query.
 * @param {string} query - The search term (e.g., "Paris", "Hiking").
 * @param {number} count - Number of images to fetch.
 * @returns {Promise<Array>} - Array of image objects with urls.
 */
export const fetchImages = async (query, count = 1) => {
    if (!PEXELS_API_KEY) {
        console.warn('Pexels API Key is missing. Using fallbacks.');
        return [];
    }

    const cacheKey = `${query}_${count}`;
    if (imageCache[cacheKey]) {
        return imageCache[cacheKey];
    }

    try {
        const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Pexels API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const images = data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large, // Good quality for Hero/Card
            thumbnail: photo.src.medium, // Good for gallery
            photographer: photo.photographer,
            photographer_url: photo.photographer_url,
            caption: photo.alt || query
        }));

        imageCache[cacheKey] = images;
        return images;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};
