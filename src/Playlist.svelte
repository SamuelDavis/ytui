<script lang="ts">
  import type { Playlist } from "./types";
  import Image from "./Image.svelte";
  import Deck from "./lib/Deck.svelte";

  export let playlist: Playlist;
  const {
    id,
    snippet: {
      localized: { title, description },
    },
    contentDetails: { itemCount = 0 } = {},
  } = playlist;
</script>

<Deck
  {id}
  title={title + "\n" + description + "\n" + JSON.stringify(playlist, null, 2)}
  caption={title}
  bubble={itemCount}
>
  <Image alt={description || title} details={playlist.snippet.thumbnails} />
</Deck>
