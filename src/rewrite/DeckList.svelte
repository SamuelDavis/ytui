<script lang="ts">
  import {
    api,
    playlists,
    dragging,
    availablePlaylists,
    pendingDelete,
  } from "./stores";
  import Content from "./Content.svelte";
  import Card from "./lib/Card.svelte";
  import { drag, drop } from "./directives";
  import type { Playlist } from "../types";

  async function addPlaylist() {
    const title = (
      prompt("What would you like the new playlist title to be?") ?? ""
    ).trim();
    if (!title) return;
    const playlist = await $api.addPlaylist(title);
    playlists.update((playlists) => [playlist, ...playlists]);
  }

  function onEmptyTrash() {
    const client = $api;
    pendingDelete.update((pending) => {
      if (pending.length === 0) return pending;
      const confirmation = pending.reduce(
        (acc, item, i) => `${acc}\n${i + 1}${item.snippet.title}`,
        "The following will be deleted."
      );
      if (confirm(confirmation) === true) {
        let pendingPlaylists = new Set();
        for (const item of pending)
          if (item.kind === "youtube#playlist") {
            client.removePlaylist(item.id);
            pendingPlaylists.add(item.id);
          }
        if (pendingPlaylists.size) {
          playlists.update((playlists) =>
            playlists.filter(({ id }) => !pendingPlaylists.has(id))
          );
        }
        return [];
      }
      return pending;
    });
  }

  function onDrag(playlist: Playlist) {
    return {
      data: playlist,
      start() {
        $dragging = playlist;
      },
      stop() {
        $dragging = null;
      },
    };
  }

  function onDrop(_, data: Playlist) {
    pendingDelete.update((pending) => [...pending, data]);
  }
</script>

<ol>
  <li>
    <Card caption="Create a new Playlist">
      <button on:click={addPlaylist}>&plus;</button>
      &plus;
    </Card>
  </li>
  {#each $availablePlaylists as playlist (playlist.id)}
    <li use:drag={onDrag(playlist)}>
      <Content data={playlist} />
    </li>
  {/each}
  <li use:drop={onDrop}>
    <Card caption="Trash" bubble={$pendingDelete.length}>
      <button on:click={onEmptyTrash}>&minus;</button>
    </Card>
  </li>
</ol>
<pre>{JSON.stringify($dragging, null, 2)}</pre>

<style lang="css">
  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  }
</style>
