<script lang="ts">
  import type { Playlist, Thumbnail, Video } from "./types";
  import { getKind } from "./types";
  import { isVideo, Kind } from "./types.js";
  import Card from "./Card.svelte";
  import { deleted } from "./stores.js";

  export let data: Playlist | Video;
  const {
    snippet: { title, description, thumbnails },
    contentDetails: { itemCount = 0 },
  } = data;
  const src = thumbnails?.default?.url ?? "";
  const srcset = Object.values(thumbnails).map((value: Thumbnail) => {
    const { url, width, height } = value;
    return `${url} ${width}w ${height}h`;
  });
  const count =
    getKind(data) === Kind.Playlist
      ? itemCount -
        $deleted.filter((d) => {
          return isVideo(d) && d.snippet.playlistId === data.id;
        }).length
      : null;
</script>

<Card {count}>
  <svelte:fragment slot="header">
    {title || description}
  </svelte:fragment>
  <img alt="thumbnail" {src} {srcset} />
</Card>

<style>
  img {
    height: 100%;
  }
</style>
