<script lang="ts">
  import { availableSelection } from "./stores";
  import ItemComponent from "./Item.svelte";
  import { draggable, dropzone } from "./directives";
  import { onSelect } from "./handlers.js";
</script>

<aside use:dropzone={onSelect}>
  <ol>
    {#each $availableSelection as data (data.id)}
      <li use:draggable={data}>
        <ItemComponent {data} />
      </li>
    {/each}
  </ol>
</aside>

<style lang="css">
  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1em;
    padding-bottom: 1em;
    min-height: 3.5in;
    overflow-x: scroll;
  }
</style>
