import { json } from "../utils/response.mjs";
import { tagValue } from "../utils/helpers.mjs";

const channelId = "UC6dl7mk7XE_VMqBNZqWOjig";
const cacheMs = Number(process.env.YOUTUBE_CACHE_MS || 10 * 60 * 1000);
let youtubeCache = { expiresAt: 0, data: null };

function parseVideos(xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries.slice(0, 30).map((entry) => {
    const id = tagValue(entry, "yt:videoId");
    return {
      id,
      title: tagValue(entry, "title"),
      published: tagValue(entry, "published"),
      description: tagValue(entry, "media:description"),
      thumbnail: entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`
    };
  });
}

async function youtubeResponse() {
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  if (!response.ok) throw new Error(`YouTube RSS failed: ${response.status}`);
  return json({ source: "youtube-rss", videos: parseVideos(await response.text()) });
}

async function getYoutubeVideos() {
  if (youtubeCache.data && youtubeCache.expiresAt > Date.now()) return youtubeCache.data;
  const data = JSON.parse(await youtubeResponse());
  youtubeCache = { data, expiresAt: Date.now() + cacheMs };
  return data;
}

export { channelId, getYoutubeVideos, parseVideos, youtubeResponse };
