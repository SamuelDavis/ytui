export function draggable<D>(el: HTMLElement, data: D) {
  el.setAttribute("draggable", "true");
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    setTimeout(() => {
      el.classList.add("dragging");
    });
  });
  el.addEventListener("dragend", (e) => {
    el.classList.remove("dragging");
  });
}

export function dropzone<D>(el: HTMLElement, onDrop: (data: D) => void) {
  el.addEventListener("dragenter", (e) => {
    el.classList.add("focus");
  });
  el.addEventListener(
    "dragleave",
    (e: DragEvent & { fromElement: HTMLElement }) => {
      if (
        el.compareDocumentPosition(e.fromElement) &
        Node.DOCUMENT_POSITION_CONTAINED_BY
      ) {
        e.preventDefault();
        return false;
      }
      el.classList.remove("focus");
    }
  );
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
  el.addEventListener("drop", (e) => {
    const data = e.dataTransfer.getData("application/json") || "null";
    onDrop(JSON.parse(data) as D);
    el.classList.remove("focus");
  });
}
