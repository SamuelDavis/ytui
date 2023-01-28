<script lang="ts">
  import type { Thumbnail, ThumbnailDetails } from "./types";

  export let alt = "";
  export let details: ThumbnailDetails;
  const {
    default: { url: src },
  } = details;
  const [srcset, sizes] = Object.values(details).reduce<[string[], string[]]>(
    ([srcset, sizes], value: Thumbnail) => {
      const { url, width, height } = value;
      return [
        [...srcset, `${url} ${width}w ${height}h`],
        [...sizes, `(min-width: ${width}px)`],
      ];
    },
    [[], []]
  );
</script>

<img {src} {alt} {srcset} {sizes} />

<style lang="css">
  img {
    height: 100%;
  }
</style>
