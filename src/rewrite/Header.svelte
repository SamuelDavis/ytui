<script lang="ts">
  import { auth, user } from "./stores";

  function onLogIn() {
    $auth.signIn();
  }

  function onLogOut() {
    $auth.signOut();
  }
</script>

<header>
  {#if $user}
    <button on:click={onLogOut}>Log Out</button>
    <figure>
      <figcaption>{$user.getBasicProfile().getEmail()}</figcaption>
      <img
        src={$user.getBasicProfile().getImageUrl()}
        alt="Profile"
        title={$user.getBasicProfile().getName()}
      />
    </figure>
  {:else}
    <button on:click={onLogIn}>Log In</button>
  {/if}
</header>
<hr />

<style lang="css">
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4em;
  }
  figure {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 0;
  }
  img {
    width: 4em;
    border-radius: 50%;
  }
</style>
