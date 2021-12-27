<script lang="ts">
  import config from "../config.json";
  import type GoogleAuth = gapi.auth2.GoogleAuth;
  import type GoogleUser = gapi.auth2.GoogleUser;
  import PlaylistListItem from "./PlaylistListItem.svelte";

  let googleAuth: GoogleAuth;
  let youtube: typeof gapi.client.youtube;
  let user: GoogleUser;
  let playlists: typeof youtube.Playlist[] = [];

  async function authenticate() {
    return await googleAuth.signIn({ scope: config.youtube.scopes.join(",") });
  }

  async function loadClient() {
    gapi.client.setApiKey(config.api_key);
    await gapi.client.load("youtube", "v3");
    return gapi.client.youtube;
  }

  // Make sure the client is loaded and sign-in is complete before calling this method.
  async function fetchMyPlaylists() {
    let playlists = [];
    let pageToken = null;
    do {
      const { result } = await youtube.playlists.list({
        pageToken,
        maxResults: 100,
        mine: true,
        part: "snippet,contentDetails",
      });
      playlists = [...playlists, ...result.items];
    } while (pageToken);
    return playlists;
  }

  async function onAuthorizeAndLoad() {
    user = await authenticate();
    youtube = await loadClient();
  }

  async function onExecute() {
    playlists = await fetchMyPlaylists();
  }

  gapi.load("client:auth2", function () {
    googleAuth = gapi.auth2.init({ client_id: config.web.client_id });
  });
</script>

<main>
  <h1>Hello, world!</h1>
  <button on:click={onAuthorizeAndLoad}>Authorize and Load</button>
  <button on:click={onExecute}>Execute</button>
  <ul>
    {#each playlists as playlist}
      <li>
        <PlaylistListItem {playlist} />
      </li>
    {/each}
  </ul>
</main>
