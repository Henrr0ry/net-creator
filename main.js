let list = document.getElementById("list");
let view = document.getElementById("view")

let deviceArr = ["internet", "router", "wireless-router", "switch", "pc", "laptop", "pc-allin", "pc-old", "phone", "printer", "server", "nas"]

function RespawnObjects() {
  for (var i = 0; i < deviceArr.length; i++) {
    var deviceDiv = document.createElement('div');
    deviceDiv.className = 'device';
    var img = document.createElement('img');
    img.src = "icons/" + deviceArr[i] + ".png";
    img.title = deviceArr[i];
    img.draggable = false;
    deviceDiv.appendChild(img);
    //deviceDiv.style.backgroundImage = "url('icons/" + deviceArr[i] + ".png'";
    deviceDiv.draggable = true;
    list.appendChild(deviceDiv);
  }
}

RespawnObjects();

/*
Array.prototype.forEach.call(list.children, (element) => {
  if (element.classList.contains('device')) {
    element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text', element.outerHTML);
    });
  }
});

// Make the #view div droppable
view.addEventListener('dragover', (e) => {
  e.preventDefault();
});
view.addEventListener('drop', (e) => {
  e.preventDefault();
  const deviceHTML = e.dataTransfer.getData('text');
  view.innerHTML += deviceHTML;
});*/
//prototype

Array.prototype.forEach.call(list.children, (element) => {
    if (element.classList.contains('device')) {
      element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', element.outerHTML);
      });
    }
});

view.addEventListener('dragover', (e) => {
  e.preventDefault();
});

view.addEventListener('drop', (e) => {
  e.preventDefault();
  const deviceHTML = e.dataTransfer.getData('text');
  deviceHTML.draggable = false;
  const droppedElement = document.createElement('div');
  droppedElement.innerHTML = deviceHTML;
  const rect = view.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  droppedElement.style.position = 'absolute';
  droppedElement.style.top = `${y}px`;
  droppedElement.style.left = `${x}px`;
  view.appendChild(droppedElement);

  // Add event listeners to move the dropped element
  droppedElement.addEventListener('mousedown', (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    document.addEventListener('mousemove', (e) => {
      droppedElement.style.top = `${e.clientY - 32}px`;
      droppedElement.style.left = `${e.clientX - 32}px`;
    });
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', null, false);
    });
  });
});