<script lang="ts">
  export let bubble: string = null;
  export let caption: string = null;
</script>

<figure {...$$restProps}>
  {#if bubble !== null}
    <h3>{bubble}</h3>
  {/if}
  {#if caption !== null}
    <figcaption>{caption}</figcaption>
    <hr />
  {/if}
  <div><slot /></div>
</figure>

<style>
  :root {
    --size: 1;
    --border-radius: 10px;
  }

  figure {
    margin: 0;
    position: relative;
    width: 1.25in;
    aspect-ratio: 2.25 / 3.5;
    border-radius: var(--border-radius);
    border: 3px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5em;
    overflow: hidden;
    gap: 0.25em;
  }

  figure hr {
    width: 100%;
  }

  h3 {
    position: absolute;
    border-radius: 50px;
    background-color: white;
    width: 2em;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    bottom: -1em;
    right: 0;
  }

  div {
    pointer-events: none;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    overflow: hidden;
    display: flex;
    place-content: center;
    align-items: center;
  }

  figcaption {
    width: 100%;
    font-weight: bolder;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
