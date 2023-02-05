import type {
  PageToken,
  PlaylistId,
  PlaylistItemId,
  Title,
  VideoId,
  YouTube,
} from "./types";

export class API {
  constructor(private readonly youtube: YouTube) {}

  async *listPlaylists() {
    const channels = await this.youtube.channels.list({
      maxResults: 100,
      part: "id,snippet,contentDetails",
      mine: true,
    });

    if (channels.status === 200) {
      const playlists = await this.youtube.playlists.list({
        part: "id,snippet,contentDetails",
        id: channels.result.items[0].contentDetails.relatedPlaylists.likes,
      });
      if (playlists.status === 200) yield playlists.result.items;
    }

    let status = 200;
    let pageToken: PageToken = null;
    do {
      const playlists = await this.youtube.playlists.list({
        pageToken,
        maxResults: 100,
        part: "id,snippet,contentDetails",
        mine: true,
      });
      status = playlists.status;
      pageToken = playlists.result.nextPageToken;
      yield playlists.result.items;
    } while (status === 200 && pageToken);
  }

  async *listVideos(playlistId: PlaylistId) {
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

  async createPlaylist(title: Title) {
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

  async deletePlaylist(id: PlaylistId) {
    const response = await this.youtube.playlists.delete({ id });
    const { status } = response;
    if (status !== 204)
      throw new Error("failed to delete playlist", {
        cause: { arguments, response },
      });
  }

  async insertVideo(videoId: VideoId, playlistId: PlaylistId, position = 0) {
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

  async deleteVideo(id: PlaylistItemId) {
    const response = await this.youtube.playlistItems.delete({ id });
    const { status } = response;
    if (status !== 204)
      throw new Error("failed to delete playlist item", {
        cause: { arguments, response },
      });
  }
}
