export function drag<D, T extends HTMLElement = HTMLElement>(
  el: T,
  {
    data = null,
    start = () => {},
    stop = () => {},
  }: {
    data: D;
    start: (el: T) => void;
    stop: (el: T) => void;
  }
) {
  el.setAttribute("draggable", "true");
  el.addEventListener("dragstart", (e) => {
    setTimeout(() => {
      el.style.visibility = "hidden";
    });
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    start(el);
  });
  el.addEventListener("dragend", () => {
    el.style.visibility = "initial";
    stop(el);
  });
}
export function drop<D, T extends HTMLElement = HTMLElement>(
  el: T,
  cb: (el: T, data: D) => void
) {
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  el.addEventListener("drop", (e) => {
    const data = JSON.parse(
      e.dataTransfer.getData("application/json") || "null"
    );
    cb(el, data);
  });
}
