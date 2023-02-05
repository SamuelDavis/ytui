export type GoogleAuth = gapi.auth2.GoogleAuth;
export type GoogleUser = gapi.auth2.GoogleUser;
export type YouTube = typeof gapi.client.youtube;
export type Playlist = gapi.client.youtube.Playlist;
export type ThumbnailDetails = gapi.client.youtube.ThumbnailDetails;
export type Thumbnail = gapi.client.youtube.Thumbnail;
export type Video = gapi.client.youtube.PlaylistItem;
export type PlaylistId = Playlist["id"];
export type PlaylistItemId = Video["id"];
export type VideoId = Video["contentDetails"]["videoId"];
export type PageToken = null | string;
export type Title = (Playlist | Video)["snippet"]["title"];
export type Item = Playlist | Video;
export enum Kind {
  Unknown = "Unknown",
  Playlist = "Playlist",
  Video = "Video",
}

export function getKind(value: any): Kind {
  if (isPlaylist(value)) return Kind.Playlist;
  if (isVideo(value)) return Kind.Video;
  return Kind.Unknown;
}

export function isPlaylist(value: any): value is Playlist {
  return typeof value === "object" && /playlist$/.test(value?.kind);
}

export function isVideo(value: any): value is Video {
  return typeof value === "object" && /playlistItem$/.test(value?.kind);
}
