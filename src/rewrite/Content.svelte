<script lang="ts">
  import Card from "./lib/Card.svelte";
  import type { Playlist, PlaylistItem, Thumbnail } from "../types";
  export let data: Playlist | PlaylistItem;
  const {
    id,
    snippet,
    contentDetails: { itemCount = null },
  } = data;
  const { title, description, thumbnails } = snippet;
  const {
    default: { url: src },
  } = thumbnails;
  snippet.thumbnails.default.url;
  const [srcset, sizes] = Object.values(thumbnails).reduce<
    [string[], string[]]
  >(
    ([srcset, sizes], value: Thumbnail) => {
      const { url, width, height } = value;
      return [
        [...srcset, `${url} ${width}w ${height}h`],
        [...sizes, `(min-width: ${width}px)`],
      ];
    },
    [[], []]
  );
</script>

<Card
  {id}
  title={description}
  {...$$restProps}
  caption={title}
  bubble={itemCount}
>
  <img alt="Thumbnail" {src} {srcset} {sizes} />
</Card>
