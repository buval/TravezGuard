import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_BASE_URL = "https://api.unsplash.com";

export async function searchCityPhotos(cityName: string, count: number = 1) {
  console.log(`[Unsplash] Searching photos for: ${cityName}`);
  
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("[Unsplash] Missing Access Key");
    throw new Error("Unsplash API key not configured");
  }

  try {
    const response = await axios.get(
      `${UNSPLASH_BASE_URL}/search/photos`,
      {
        params: {
          query: `${cityName} travel destination`,
          per_page: count,
          orientation: "landscape",
          order_by: "relevant",
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    console.log(`[Unsplash] Found ${response.data.results?.length || 0} photos for ${cityName}`);
    
    return {
      results: response.data.results.map((photo: any) => ({
        id: photo.id,
        urls: {
          raw: photo.urls.raw,
          full: photo.urls.full,
          regular: photo.urls.regular,
          small: photo.urls.small,
          thumb: photo.urls.thumb,
        },
        alt_description: photo.alt_description || photo.description,
        user: {
          name: photo.user.name,
          username: photo.user.username,
          profile_url: `https://unsplash.com/@${photo.user.username}`,
        },
        download_location: photo.links.download_location,
      })),
      total: response.data.total,
    };
  } catch (error: any) {
    console.error("[Unsplash] Search error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    
    // Return empty results instead of throwing to gracefully handle failures
    return {
      results: [],
      total: 0,
    };
  }
}

export async function triggerPhotoDownload(downloadLocation: string) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("[Unsplash] Missing Access Key for download tracking");
    return;
  }

  try {
    await axios.get(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    console.log("[Unsplash] Download tracked successfully");
  } catch (error) {
    console.error("[Unsplash] Failed to track download:", error);
  }
}
