import type { Readable, Writable } from "svelte/store";
import { derived, writable } from "svelte/store";
import type { GoogleAuth, GoogleUser, Item, Playlist } from "./types";
import type { API } from "./API";
import { onSignIn, onSignOut } from "./handlers";

export const auth = writable<GoogleAuth>(null);
export const user = writable<GoogleUser>(null);
export const api = writable<API>(null);
export const playlists = writable<Playlist[]>([]);
export const selected = writable<Item[]>([]);
export const deleted = writable<Item[]>([]);

export const availablePlaylists = diff(playlists, deleted);
export const availableSelection = diff(selected, deleted);

export function removeFromStore<T extends Item>(store: Writable<T[]>, item: T) {
  return store.update((items) => items.filter(({ id }) => id !== item.id));
}

export async function generatorToArray<T>(generator: AsyncGenerator<T[]>) {
  let acc: T[] = [];
  for await (const items of generator) acc = [...items, ...acc];
  return acc;
}

function diff<T extends { id?: string }>(a: Readable<T[]>, b: Readable<T[]>) {
  return derived([a, b], ([a, b]) =>
    a.filter((a) => !b.some((b) => a.id === b.id))
  );
}

auth.subscribe((auth) => {
  if (!auth) return;
  auth.currentUser.listen((currentUser) => {
    if (currentUser.isSignedIn()) onSignIn(currentUser);
    else onSignOut();
  });
});
