import type { YouTube } from "./types";

export async function* fetchPlaylists(client: YouTube) {
  let status = 200;
  let pageToken = null;
  do {
    const response = await client.playlists.list({
      pageToken,
      maxResults: 5,
      mine: true,
      part: "id,snippet,contentDetails",
    });
    status = response.status;
    pageToken = response.result.nextPageToken;
    yield response.result.items;
  } while (status === 200 && pageToken);
}
