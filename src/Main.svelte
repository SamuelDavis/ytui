<script lang="ts">
  import { availablePlaylists, deleted } from "./stores";
  import ItemComponent from "./Item.svelte";
  import { draggable, dropzone } from "./directives";
  import Card from "./Card.svelte";
  import {
    onAddToPlaylist,
    onCreatePlaylist,
    onQueueForDeletion,
    onReviewPendingDeletions,
  } from "./handlers.js";
</script>

<main>
  <ol>
    <li use:dropzone={onCreatePlaylist}>
      <Card>
        <svelte:fragment slot="header">Create Playlist</svelte:fragment>
        <button on:click={onCreatePlaylist} title="Create Playlist">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </Card>
    </li>
    <li use:dropzone={onQueueForDeletion}>
      <Card count={$deleted.length}>
        <svelte:fragment slot="header">
          Review Pending Deletions
        </svelte:fragment>
        <button
          on:click={onReviewPendingDeletions}
          disabled={$deleted.length === 0}
          title="Review Pending Deletions"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
              fill="currentColor"
            />
            <path d="M9 9H11V17H9V9Z" fill="currentColor" />
            <path d="M13 9H15V17H13V9Z" fill="currentColor" />
          </svg>
        </button>
      </Card>
    </li>
    {#each $availablePlaylists as data (`${data.id}:${data.contentDetails.itemCount}`)}
      <li use:draggable={data} use:dropzone={onAddToPlaylist(data)}>
        <ItemComponent {data} />
      </li>
    {/each}
  </ol>
</main>

<style>
  main {
    overflow-y: scroll;
  }

  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }

  button {
    width: 100%;
    height: 100%;
  }
</style>
