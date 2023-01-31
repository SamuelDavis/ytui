<script lang="ts">
  import Header from "./Header.svelte";
  import { auth, user, playlists } from "./stores";
  import { CLIENT_ID, SCOPES } from "../../config.json";
  import DeckList from "./DeckList.svelte";

  gapi.load("client:auth2", () => {
    auth.set(
      gapi.auth2.init({ client_id: CLIENT_ID, scope: SCOPES.join(",") })
    );
  });
</script>

<Header />
{#if $user}
  <DeckList />
{/if}
