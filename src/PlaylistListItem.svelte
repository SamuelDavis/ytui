<script lang="ts">
  import type YouTube = gapi.client.youtube;
  export let playlist: YouTube.Playlist;

  const { contentDetails, snippet } = playlist;
  const { title, thumbnails } = snippet;
</script>

<details>
  <summary>
    <img src={thumbnails.default.url} alt={title} />
    <h1>
      {title} ({contentDetails.itemCount})
    </h1>
  </summary>
  <pre>{JSON.stringify(playlist, null, 2)}</pre>
</details>

<style lang="css">
  summary {
    display: flex;
  }
</style>
