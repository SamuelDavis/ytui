<script lang="ts">
  import type { Playlist } from "./types";
  import Image from "./Image.svelte";

  export let playlist: Playlist;
  const {
    id,
    snippet: {
      localized: { title, description },
    },
    contentDetails: { itemCount },
  } = playlist;
</script>

<figure {id} title={JSON.stringify(playlist, null, 2)}>
  <h3>{itemCount}</h3>
  <figcaption>{title}</figcaption>
  <div>
    <Image alt={description || title} details={playlist.snippet.thumbnails} />
  </div>
</figure>

<style>
  :root {
    --size: 1;
    --border-radius: 10px;
  }

  figure {
    margin: 0;
    position: relative;
    width: 1.25in;
    aspect-ratio: 2.25 / 3.5;
    border-radius: var(--border-radius);
    border: 3px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5em;
    overflow: hidden;
  }

  h3 {
    position: absolute;
    border-radius: 50px;
    background-color: white;
    width: 2em;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    bottom: -1em;
    right: 0;
  }

  div {
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  figcaption {
    font-weight: bolder;
  }
</style>
