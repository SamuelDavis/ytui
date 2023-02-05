<script lang="ts">
  export let count: number = null;
</script>

<article>
  <header>
    <slot name="header" />
  </header>
  <hr />
  <section>
    <slot />
  </section>
  {#if count !== null}
    <span>{count}</span>
  {/if}
</article>

<style lang="css">
  article {
    height: 3.5in;
    width: 2.25in;

    display: flex;
    flex-direction: column;
    align-items: center;

    border-radius: var(--border-radius);
    border: 1px solid black;

    padding: 0.5em;
    position: relative;
  }

  article > * {
    width: 100%;
  }

  header {
    width: 100%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    min-height: 1.25em;
  }

  section {
    overflow: hidden;

    display: flex;
    flex-grow: 1;
    place-content: center;

    border-radius: var(--border-radius);
    border: 1px solid black;
  }

  span {
    background-color: white;
    position: absolute;
    aspect-ratio: 1;
    width: 3em;
    border-radius: 50%;
    display: grid;
    place-content: center;
    right: 0;
    bottom: 0;
  }
</style>
