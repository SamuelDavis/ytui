export function draggable<T extends HTMLElement = HTMLElement>(e: T) {
  e.setAttribute("draggable", "true");
  e.addEventListener(
    "dragstart",
    () => {
      setTimeout(() => {
        e.classList.add("dragging");
      });
    },
    true
  );
  e.addEventListener(
    "dragend",
    () => {
      e.classList.remove("dragging");
      document
        .querySelectorAll(".focus")
        .forEach((el) => el.classList.remove("focus"));
    },
    true
  );
}

export function dropzone<T extends HTMLElement = HTMLElement>(e: T) {
  e.addEventListener(
    "dragenter",
    () => {
      e.classList.add("focus");
    },
    true
  );
}
