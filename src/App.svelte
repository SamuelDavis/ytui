<script lang="ts">
  import config from "../config.json";
  import PlaylistComponent from "./Playlist.svelte";
  import {
    googleAuth,
    youtube,
    user,
    playlists,
    activePlaylists,
  } from "./store";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import { fetchPlaylists } from "./api";
  import { draggable } from "./directives.js";

  gapi.load("client:auth2", () => {
    $googleAuth = gapi.auth2.init({
      client_id: config.CLIENT_ID,
      scope: config.SCOPES.join(","),
    });
    $googleAuth.currentUser.listen(async (currentUser) => {
      if (currentUser.isSignedIn()) {
        $user = currentUser;
        gapi.client.setApiKey(config.API_KEY);
        await Promise.all(
          config.DISCOVERY_DOCS.map((url) => gapi.client.load(url))
        );
        $youtube = gapi.client.youtube;
        if (Object.keys($playlists).length) {
          console.info("Playlists already fetched.");
        } else {
          console.info("Fetching playlists");
          for await (const items of fetchPlaylists($youtube))
            playlists.update((playlists) =>
              items.reduce(
                (acc, playlist) => ({ ...acc, [playlist.id]: playlist }),
                playlists
              )
            );
        }
      } else {
        $user = null;
        $youtube = null;
        $playlists = {};
      }
    });
  });
</script>

<Header />
{#if $user}
  <main>
    <section>
      <ol>
        {#each $activePlaylists as playlist (playlist.id)}
          <li use:draggable={playlist}>
            <PlaylistComponent {playlist} />
          </li>
        {:else}
          <li>
            <h1>You have no YouTube playlists.</h1>
          </li>
        {/each}
      </ol>
    </section>
  </main>
  <Footer />
{/if}

<style lang="css">
  main {
    display: grid;
    place-content: center;
  }

  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1em;
    flex-shrink: 1;
    flex-wrap: wrap;
  }
</style>
