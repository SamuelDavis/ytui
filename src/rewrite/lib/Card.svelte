<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  export let caption: string = "";
  export let bubble: string = null;
</script>

<figure {...$$restProps}>
  <figcaption>{caption}</figcaption>
  <hr />
  <div><slot /></div>
  {#if bubble !== null}
    <h3>{bubble}</h3>
  {/if}
</figure>

<style>
  figure {
    background-color: white;
    position: relative;
    margin: 0;

    aspect-ratio: 2.25/3.5;
    width: 1.5in;

    overflow: hidden;

    display: flex;
    flex-direction: column;

    border-radius: 10px;
    border: 3px solid black;
    padding: 0.25em;
  }

  hr {
    width: 100%;
  }

  figcaption {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }

  button,
  div {
    overflow: hidden;
    flex: 1 1;
    border-radius: 10px;
  }

  div :global(> *) {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  h3 {
    margin: 0;
    background-color: inherit;
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    overflow: hidden;
    padding: 0.5em;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
  }
</style>
