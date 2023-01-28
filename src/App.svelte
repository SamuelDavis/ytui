<script lang="ts">
  import config from "../config.json";
  import PlaylistComponent from "./Playlist.svelte";
  import { googleAuth, youtube, user, playlists } from "./store";
  import Header from "./Header.svelte";
  import { fetchPlaylists } from "./api";
  import Deck from "./lib/Deck.svelte";

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
<main>
  <ol>
    {#each $playlists as playlist}
      <li>
        <PlaylistComponent {playlist} />
      </li>
    {/each}
    <li>
      <Deck caption="Add new Playlist">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
          />
        </svg>
      </Deck>
    </li>
    <li>
      <Deck caption="Trash">
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
    </li>
    <li />
  </ol>
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
