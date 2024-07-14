let list = document.getElementById("list");
let view = document.getElementById("view")

list.querySelectorAll(".device").forEach((element) => {
  element.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text", event.target.outerHTML);
  });
});

view.addEventListener("drop", (event) => {
  event.preventDefault();
  const draggedElement = event.dataTransfer.getData("text");
  view.innerHTML += draggedElement;
});

view.addEventListener("drop", (event) => {
  event.preventDefault();
  const draggedElement = event.dataTransfer.getData("text");
  view.removeChild(event.target);
  view.appendChild(draggedElement);
});