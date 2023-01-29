import { derived, writable } from "svelte/store";
import type { GoogleAuth, GoogleUser, Playlist, YouTube } from "./types";

export const youtube = writable<YouTube>(null);
export const googleAuth = writable<GoogleAuth>(null);
export const user = writable<GoogleUser>(null);
export const playlists = persistent<Record<Playlist["id"], Playlist>>(
  "playlists",
  {}
);
export const pendingDelete = persistent<
  Record<Playlist["id"], Playlist["snippet"]["title"]>
>("pendingDelete", {});

export const activePlaylists = derived(
  [playlists, pendingDelete],
  ([playlists, pendingDelete]) =>
    Object.values(playlists).filter(
      (playlist) => !(playlist.id in pendingDelete)
    ),
  []
);

function persistent<T>(key: string, initial: T = null) {
  const value = localStorage.getItem(key);
  const store = writable<T>(value === null ? initial : JSON.parse(value));
  store.subscribe((value) => localStorage.setItem(key, JSON.stringify(value)));
  return store;
}
