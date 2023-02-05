<script lang="ts">
  import type { Playlist, Thumbnail, Video } from "./types";
  import { getKind, isPlaylist } from "./types";
  import { isVideo, Kind } from "./types.js";
  import Card from "./Card.svelte";
  import { deleted } from "./stores.js";

  export let data: Playlist | Video;
  const {
    snippet: { title, description, thumbnails },
    contentDetails: { itemCount = 0 },
  } = data;

  const href = isPlaylist(data)
    ? `https://www.youtube.com/playlist?list=${data.id}`
    : `https://www.youtube.com/watch?${new URLSearchParams({
        v: data.contentDetails.videoId,
        list: data.snippet.playlistId,
        index: data.snippet.position.toString(),
      })}`;

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
    <a {href} rel="noreferrer" target="_blank" on:drag|preventDefault
      >{title || description}</a
    >
  </svelte:fragment>
  <img alt="thumbnail" {src} {srcset} />
</Card>

<style>
  img {
    pointer-events: none;
    height: 100%;
  }
</style>
