import type {
  PageToken,
  PlaylistId,
  PlaylistItemId,
  Title,
  VideoId,
  YouTube,
} from "../types";

export class API {
  constructor(private readonly youtube: YouTube) {}

  async *listPlaylists() {
    let status = 200;
    let pageToken: PageToken = null;
    do {
      const response = await this.youtube.playlists.list({
        pageToken,
        maxResults: 100,
        part: "id,snippet,contentDetails",
        mine: true,
      });
      status = response.status;
      pageToken = response.result.nextPageToken;
      yield response.result.items;
    } while (status === 200 && pageToken);
  }

  async *listPlaylistItems(playlistId: PlaylistId) {
    let status = 200;
    let pageToken: PageToken = null;
    do {
      const response = await this.youtube.playlistItems.list({
        pageToken,
        maxResults: 100,
        part: "id,snippet,contentDetails",
        playlistId,
      });
      status = response.status;
      pageToken = response.result.nextPageToken;
      yield response.result.items;
    } while (status === 200 && pageToken);
  }

  async addPlaylist(title: Title) {
    const response = await this.youtube.playlists.insert({
      part: ["snippet,status,contentDetails"],
      resource: { snippet: { title }, status: { privacyStatus: "private" } },
    });
    const { status, result } = response;
    if (status === 200) return result;
    else
      throw new Error("failed to create playlist", {
        cause: { arguments, response },
      });
  }

  async removePlaylist(id: PlaylistId) {
    const response = await this.youtube.playlists.delete({ id });
    const { status } = response;
    if (status !== 204)
      throw new Error("failed to delete playlist", {
        cause: { arguments, response },
      });
  }

  async addPlaylistItem(
    videoId: VideoId,
    playlistId: PlaylistId,
    position = 0
  ) {
    const response = await this.youtube.playlistItems.insert({
      part: ["snippet"],
      resource: {
        snippet: {
          playlistId,
          position,
          resourceId: { kind: "youtube#video", videoId },
        },
      },
    });
    const { status, result } = response;
    if (status === 200) return result;
    else
      throw new Error("failed to add playlist item", {
        cause: { arguments, response },
      });
  }

  async removePlaylistItem(id: PlaylistItemId) {
    const response = await this.youtube.playlistItems.delete({ id });
    const { status } = response;
    if (status !== 204)
      throw new Error("failed to delete playlist item", {
        cause: { arguments, response },
      });
  }
}
