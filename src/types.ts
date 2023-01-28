export type GoogleAuth = gapi.auth2.GoogleAuth;
export type GoogleUser = gapi.auth2.GoogleUser;
export type YouTube = typeof gapi.client.youtube;
export type Playlist = gapi.client.youtube.Playlist;
export type ThumbnailDetails = gapi.client.youtube.ThumbnailDetails;
export type Thumbnail = gapi.client.youtube.Thumbnail;
export type Targeted<
  E extends Event,
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = T
> = E & {
  target: T;
  currentTarget: C;
};
