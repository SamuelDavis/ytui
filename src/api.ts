import type { Playlist, YouTube } from "./types";
import { playlists } from "./store";

export async function* fetchPlaylistItems(
  client: YouTube,
  playlistId: Playlist["id"]
) {
  let status = 200;
  let pageToken = null;
  do {
    const response = await client.playlistItems.list({
      pageToken,
      playlistId,
      part: ["id,snippet,contentDetails"],
      maxResults: 100,
    });
    status = response.status;
    pageToken = response.result.nextPageToken;
    yield response.result.items;
  } while (status === 200 && pageToken);
}

export async function* fetchPlaylists(client: YouTube) {
  let status = 200;
  let pageToken = null;
  do {
    const response = await client.playlists.list({
      pageToken,
      maxResults: 100,
      mine: true,
      part: "id,snippet,contentDetails",
    });
    status = response.status;
    pageToken = response.result.nextPageToken;
    yield response.result.items;
  } while (status === 200 && pageToken);
}

export async function createPlaylist(client: YouTube, title: string) {
  const response = await client.playlists.insert({
    part: ["snippet,status"],
    resource: {
      snippet: {
        title,
      },
      status: {
        privacyStatus: "private",
      },
    },
  });
  const { status, result } = response;
  if (status === 200)
    playlists.update((playlists) => ({ ...playlists, [result.id]: result }));
  else console.error("create playlist", response);
}

export async function deletePlaylist(client: YouTube, id: string) {
  const response = await client.playlists.delete({
    id,
  });

  const { status } = response;
  if (status === 204) playlists.update(({ [id]: _, ...rest }) => rest);
  else console.error("delete playlist", response);
}
