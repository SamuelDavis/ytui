import {
  api,
  deleted,
  generatorToArray,
  playlists,
  removeFromStore,
  selected,
  user,
} from "./stores";
import type { GoogleUser, Item, Playlist, PlaylistId } from "./types";
import { getKind, isPlaylist, isVideo, Kind } from "./types";
import { get } from "svelte/store";
import { API } from "./API";
import { API_KEY, DISCOVERY_DOCS } from "./../config.json";

export function onSignIn(currentUser: GoogleUser) {
  user.set(currentUser);
  gapi.client.setApiKey(API_KEY);
  Promise.all(DISCOVERY_DOCS.map((url) => gapi.client.load(url))).then(
    async () => {
      const client = new API(gapi.client.youtube);
      api.set(client);
      playlists.set(await generatorToArray(client.listPlaylists()));
    }
  );
}

export function onSignOut() {
  user.set(null);
  api.set(null);
  playlists.set([]);
}

export async function onCreatePlaylist(item: null | Item) {
  if (isPlaylist(item)) return removeFromStore(deleted, item);

  const title = (prompt("Playlist Title") ?? "").trim();
  if (!title) return;

  const client = get(api);
  const playlist = await client.createPlaylist(title);
  if (isVideo(item)) {
    removeFromStore(selected, item);
    await client.insertVideo(item.contentDetails.videoId, playlist.id);
    playlist.contentDetails.itemCount++;
    playlist.snippet.thumbnails = item.snippet.thumbnails;
  }
  playlists.update((items) => [playlist, ...items]);
}

export function onQueueForDeletion(item: Item) {
  if (isVideo(item)) {
    modifyPlaylistCount([item.snippet.playlistId, -1]);
  }
  deleted.update((items) => [item, ...items]);
}

export function onReviewPendingDeletions() {
  deleted.update((items) => {
    if (items.length === 0) return items;

    const padLen = items.length.toString().length;
    const message = items.reduce((acc, item, i, items) => {
      const index = (i + 1).toString().padStart(padLen, "0");
      return `${acc}\n${index} - (${getKind(item)}) ${item.snippet.title}`;
    }, "Permanently delete the following:");
    if (confirm(message)) {
      const client = get(api);
      items.forEach((item) => {
        switch (getKind(item)) {
          case Kind.Playlist:
            removeFromStore(playlists, item);
            return client.deletePlaylist(item.id);
          case Kind.Video:
            removeFromStore(selected, item);
            return client.deleteVideo(item.id);
          default:
            console.error(new Error("unknown deleted item"));
            return Promise.resolve();
        }
      });
      return [];
    }

    return items;
  });
}

export async function onSelect(item: Playlist | Item[]) {
  if (isPlaylist(item))
    selected.set(await generatorToArray(get(api).listVideos(item.id)));
  else selected.set(item);
}

export function onAddToPlaylist(playlist: Playlist) {
  const client = get(api);
  return function (item: Item) {
    if (isVideo(item)) {
      removeFromStore(selected, item);
      client.deleteVideo(item.id);
      client.insertVideo(item.contentDetails.videoId, playlist.id);
      modifyPlaylistCount([item.snippet.playlistId, -1], [playlist.id, +1]);
    } else if (isPlaylist(item)) {
      generatorToArray(client.listVideos(item.id)).then((videos) => {
        for (const video of videos) client.insertVideo(video.id, playlist.id);
        modifyPlaylistCount([playlist.id, videos.length]);
        removeFromStore(playlists, item);
      });

      console.debug({ add: item, to: playlist });
    }
  };
}

function modifyPlaylistCount(...updates: [PlaylistId, number][]) {
  playlists.update((playlists) => {
    return playlists.map((playlist) => {
      for (const [id, mod] of updates)
        if (id === playlist.id) {
          playlist.contentDetails.itemCount += mod;
          break;
        }
      return playlist;
    });
  });
}
