<script lang="ts">
  import { googleAuth, user } from "./store";

  function logIn() {
    $googleAuth.signIn();
  }

  function logOut() {
    $googleAuth.signOut();
    localStorage.clear();
  }

  $: profile = $user?.getBasicProfile();
</script>

<header>
  {#if $user}
    <button on:click={logOut}>Log Out</button>
    <figure>
      <img
        referrerpolicy="no-referrer"
        src={profile?.getImageUrl()}
        alt={profile?.getName()}
      />
      <figcaption>
        {profile?.getEmail()}
      </figcaption>
    </figure>
  {:else}
    <button on:click={logIn}>Log In</button>
  {/if}
</header>
<hr />

<style lang="css">
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row-reverse;
    height: 2em;
  }

  header figure {
    display: flex;
    gap: 1em;
    align-items: center;
    margin: 0;
  }

  header figure img {
    width: 2em;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
  }
</style>
