<script lang="ts">
  import config from "../config.json";
  import PlaylistComponent from "./Playlist.svelte";
  import { googleAuth, youtube, user, playlists } from "./store";
  import Header from "./Header.svelte";
  import { fetchPlaylists } from "./api";

  gapi.load("client:auth2", () => {
    $googleAuth = gapi.auth2.init({
      client_id: config.CLIENT_ID,
    });
    $googleAuth.currentUser.listen(async (currentUser) => {
      if (currentUser.isSignedIn()) {
        $user = currentUser;
        gapi.client.setApiKey(config.API_KEY);
        await Promise.all(
          config.DISCOVERY_DOCS.map((url) => gapi.client.load(url))
        );
        $youtube = gapi.client.youtube;
        if ($playlists.length) {
          console.info("Playlists already fetched.");
        } else {
          console.info("Fetching playlists");
          for await (const items of fetchPlaylists($youtube))
            $playlists = [...$playlists, ...items];
        }
      } else {
        $user = null;
        $youtube = null;
        $playlists = [];
      }
    });
  });
</script>

<Header />
<hr />
<main>
  <ol>
    {#each $playlists as playlist}
      <li>
        <PlaylistComponent {playlist} />
      </li>
    {/each}
  </ol>
  <h1>Hello, World!</h1>
</main>

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
