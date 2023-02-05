<script lang="ts">
  import { auth, user } from "./stores";

  const signIn = () => $auth.signIn();
  const signOut = () => $auth.signOut();
</script>

<header>
  {#if $user}
    <button on:click={signOut}>Sign Out</button>
  {:else}
    <button on:click={signIn}>Sign In</button>
  {/if}
</header>
