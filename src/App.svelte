<script lang="ts">
  import { CLIENT_ID, SCOPES } from "../config.json";
  import { auth, user } from "./stores";
  import Header from "./Header.svelte";
  import Main from "./Main.svelte";
  import Selected from "./Selected.svelte";

  gapi.load("client:auth2", () => {
    $auth = gapi.auth2.init({ client_id: CLIENT_ID, scope: SCOPES.join(",") });
  });
</script>

<Header />
<hr />
{#if $user}
  <Main />
  <hr />
  <Selected />
{/if}
