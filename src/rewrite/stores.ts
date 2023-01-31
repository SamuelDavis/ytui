import { derived, get, writable } from "svelte/store";
import type {
  GoogleAuth,
  GoogleUser,
  Playlist,
  PlaylistItem,
  YouTube,
} from "../types";
import { API_KEY, DISCOVERY_DOCS } from "../../config.json";
import { API } from "./API";

export const auth = writable<GoogleAuth>(null);
export const user = writable<GoogleUser>(null);
export const youtube = writable<YouTube>(null);
export const playlists = writable<Playlist[]>([]);
export const playlistItems = writable<PlaylistItem[]>([]);
export const pendingDelete = writable<(Playlist | PlaylistItem)[]>([]);
export const dragging = writable<Playlist | PlaylistItem>(null);
export const api = derived([youtube], ([youtube]) =>
  youtube ? new API(youtube) : null
);
export const availablePlaylists = derived(
  [playlists, pendingDelete],
  ([playlists, pendingDelete]) => {
    if (pendingDelete.length === 0) return playlists;
    const pending = new Set(pendingDelete.map(({ id }) => id));
    return playlists.filter(({ id }) => !pending.has(id));
  }
);

auth.subscribe(async (auth) => {
  if (!auth) return;
  auth.currentUser.listen(async (currentUser) => {
    currentUser.isSignedIn() ? onLogIn(currentUser) : onLogOut();
  });
});

function onLogIn(currentUser: GoogleUser) {
  user.set(currentUser);
  gapi.client.setApiKey(API_KEY);
  Promise.all(DISCOVERY_DOCS.map((url) => gapi.client.load(url))).then(
    async () => {
      youtube.set(gapi.client.youtube);
      for await (const items of get(api).listPlaylists())
        playlists.update((playlists) => [...playlists, ...items]);
    }
  );
}

function onLogOut() {
  user.set(null);
  youtube.set(null);
  playlists.set([]);
  playlistItems.set([]);
  pendingDelete.set([]);
}
