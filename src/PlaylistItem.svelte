<script lang="ts">
  import type { PlaylistItem } from "./types";
  import Image from "./Image.svelte";
  import Deck from "./lib/Deck.svelte";

  export let item: PlaylistItem;
  const {
    id,
    snippet: { title, description },
  } = item;
</script>

<Deck
  {id}
  title={title + "\n" + description + "\n" + JSON.stringify(item, null, 2)}
  caption={title}
>
  {#if item?.snippet?.thumbnails?.default}
    <Image alt={description || title} details={item.snippet.thumbnails} />
  {/if}
</Deck>
