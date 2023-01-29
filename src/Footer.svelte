<script lang="ts">
  import Deck from "./lib/Deck.svelte";
  import { draggable, dropzone } from "./directives.js";
  import { createPlaylist, deletePlaylist } from "./api";
  import { pendingDelete, playlists, youtube } from "./store";
  import type { Playlist } from "./types";

  function onCreatePlaylist() {
    const name = (prompt("Playlist Name") ?? "").trim();
    if (!name) return;
    createPlaylist($youtube, name);
  }

  function onLoadPlaylist(playlist: Playlist) {
    console.debug({ load: playlist });
  }
  function onDeletePlaylist(playlist: Playlist) {
    pendingDelete.update((value) => ({
      ...value,
      [playlist.id]: playlist.snippet.title,
    }));
  }

  function onDelete() {
    pendingDelete.update((pending) => {
      const titles = Object.values(pending);
      if (titles.length === 0) return pending;

      const confirmation = `The following playlists will be deleted:\n${titles.join(
        "\n"
      )}`;
      if (!confirm(confirmation)) return pending;

      const client = $youtube;
      Object.keys(pending).forEach((id) => deletePlaylist(client, id));

      playlists.update((playlists) =>
        Object.fromEntries(
          Object.entries(playlists).filter(([key, _]) => !(key in pending))
        )
      );

      return {} as typeof pending;
    });
  }
</script>

<hr />
<footer>
  <ol use:dropzone={onLoadPlaylist}>
    <li>
      <Deck caption="Previous">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19.071 17V15H11.071V17H19.071Z" fill="currentColor" /><path
            d="M19.071 9V7H11.071V9H19.071Z"
            fill="currentColor"
          />
          <path
            d="M19.071 12.9999V10.9999H9.07109V7.96454L5 11.9644L9.07109 15.9644V12.9999H19.071Z"
            fill="currentColor"
          />
        </svg>
      </Deck>
    </li>
    {#each new Array(10).fill(undefined) as _, i}
      <li use:draggable>
        <Deck caption={`Video ${i}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
              fill="currentColor"
            />
            <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="currentColor" />
          </svg>
        </Deck>
      </li>
    {/each}
    <li>
      <Deck caption="Next">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M5 17V15H13V17H5Z" fill="currentColor" />
          <path d="M5 9V7H13V9H5Z" fill="currentColor" />
          <path
            d="M5 12.9999V10.9999H14.9999V7.96454L19.071 11.9644L14.9999 15.9644V12.9999H5Z"
            fill="currentColor"
          />
        </svg>
      </Deck>
    </li>
  </ol>
  <button on:click={onCreatePlaylist}>
    <Deck caption="Add new Playlist">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
        />
      </svg>
    </Deck>
  </button>
  <button use:dropzone={onDeletePlaylist} on:click={onDelete}>
    <Deck caption="Trash" bubble={Object.keys($pendingDelete).length || null}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
        />
        <path
          fill-rule="evenodd"
          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
        />
      </svg>
    </Deck>
  </button>
</footer>

<style lang="css">
  footer {
    display: flex;
    gap: 1em;
    align-items: center;
  }

  ol {
    display: flex;
    gap: 1em;
    list-style-type: none;
    margin: 0;
    padding: 0.25em;
    overflow-x: scroll;
    border: 3px solid black;
    border-radius: 10px;
  }

  ol:first-child {
    flex-grow: 1;
  }
</style>
