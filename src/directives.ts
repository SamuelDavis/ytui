export function draggable<D, T extends HTMLElement = HTMLElement>(
  el: T,
  data: D = null
) {
  el.setAttribute("draggable", "true");
  el.addEventListener("dragstart", (e) => {
    if (data !== null)
      e.dataTransfer.setData("application/json", JSON.stringify(data));
    setTimeout(() => {
      el.classList.add("dragging");
    });
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
  });
}

export function dropzone<D, T extends HTMLElement = HTMLElement>(
  el: T,
  onDrop: (data: D, el: T) => void = null
) {
  let counter = 0;
  el.addEventListener(
    "dragenter",
    () => {
      counter++;
      el.classList.add("focus");
    },
    true
  );
  el.addEventListener("dragleave", () => {
    counter--;
    if (counter === 0) el.classList.remove("focus");
  });
  if (onDrop !== null) {
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    el.addEventListener("drop", (e) => {
      el.classList.remove("focus");
      const data = JSON.parse(
        e.dataTransfer.getData("application/json") ?? "null"
      ) as D;
      onDrop(data, el);
    });
  }
}
