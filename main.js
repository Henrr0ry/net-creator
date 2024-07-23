let list = document.getElementById("list");
let list2 = document.getElementById("list2");
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
    deviceDiv.draggable = true;
    deviceDiv.setAttribute("data-movex", 32)
    deviceDiv.setAttribute("data-movey", 32)
    list.appendChild(deviceDiv);
  }
}

RespawnObjects();
//TOOLBAR
let toolbar = document.getElementById("toolbar");
let tbdetails = document.getElementById("tbdetails");

function toolupdate(id) {
  Array.prototype.forEach.call(toolbar.children, element => {
    if (element.id == "t" + id)
      element.classList.add("selected");
    else
      element.classList.remove("selected");
  });
  Array.prototype.forEach.call(tbdetails.children, element => {
    if (element.id == "c" + id)
      element.classList.add("selected");
    else
      element.classList.remove("selected");
  });
}

//CREATE OBJECT

Array.prototype.forEach.call(list.children, (element) => {
  if (element.classList.contains('device')) {
    element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text', element.outerHTML);
    });
  }
});

Array.prototype.forEach.call(list2.children, (element) => {
  if (element.classList.contains('label') || element.classList.contains('point')) {
    element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text', element.outerHTML);
    });
  }
});

view.addEventListener('dragover', (e) => {
  e.preventDefault();
});

let startpoint = 0;

view.addEventListener('drop', (e) => {
  e.preventDefault();
  const deviceHTML = e.dataTransfer.getData('text');
  const parser = new DOMParser();
  const droppedElement = parser.parseFromString(deviceHTML, "text/html").body.children[0];
  droppedElement.draggable = true;
  const rect = view.getBoundingClientRect();
  const x = e.clientX - droppedElement.getAttribute('data-movex');
  const y = e.clientY - droppedElement.getAttribute('data-movey');
  droppedElement.style.position = 'absolute';
  droppedElement.style.top = `${y}px`;
  droppedElement.style.left = `${x}px`;

  //element update
  view.appendChild(droppedElement);

  droppedElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text', droppedElement.outerHTML);
  })
  droppedElement.addEventListener('dragend', (e) => {
    droppedElement.remove();
  })

  //point update
  if (droppedElement.classList.contains("point"))
    {
      if (droppedElement.getAttribute("data-point") == "none") {
        droppedElement.setAttribute("data-point", String(startpoint));
  
        var temp = 0;
        Array.prototype.forEach.call(view.children, (element) => {
          if (element.classList.contains('point')) {
            if (element.getAttribute("data-point") == startpoint)
              temp += 1;
          }});
        if (temp >= 2) {
          startpoint += 1;
          //add line
          //https://www.youtube.com/watch?v=LgTrwpMCww8
        }
      }
    }
});