export interface GooglePlace {
    displayName?: { text: string; languageCode?: string };
    formattedAddress?: string;
    websiteUri?: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    businessStatus?: string;
    types?: string[];
}

export async function searchPlaces(query: string, limit: number = 20): Promise<GooglePlace[]> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('Missing GOOGLE_MAPS_API_KEY environment variable.');
        return [];
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.internationalPhoneNumber,places.businessStatus,places.types',
                'Referer': 'http://localhost:3000/' // Include referer just in case the key has HTTP referer restrictions
            },
            body: JSON.stringify({
                textQuery: query,
                pageSize: limit,
                languageCode: 'en'
            }),
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Google Places API Error:', response.status, response.statusText, errorData);
            return [];
        }

        const data = await response.json();

        // Return places or empty array if none found
        return data.places || [];
    } catch (error) {
        console.error('Failed to fetch from Google Places API:', error);
        return [];
    }
}
