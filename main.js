let list = document.getElementById("list");
let list2 = document.getElementById("list2");
let view = document.getElementById("view")
let x1 = [];
let y1 = [];
let lineTitle = "";

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

  //label update
  if (droppedElement.classList.contains("label")) {
    droppedElement.addEventListener('input', (event) => { // Změňuje 'change' na 'input'
        const currentText = event.target.value;

        // Iterujeme přes children
        for (const child of droppedElement.children) {
            // Kontrolujeme, zda je child element typu INPUT
            if (child.nodeName === "INPUT") {
                child.placeholder = currentText; // Opravený název vlastnosti 'placeholder'
            }
        }
    });
}

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
        var line = document.createElement("div");
        line.setAttribute("data-point", startpoint);
        line.classList.add("line");
        line.draggable = false;
        view.appendChild(line);
        startpoint += 1;
        //add line
        //https://www.youtube.com/watch?v=LgTrwpMCww8
      }
    }
  }
  // update line

  setTimeout(() => {
    for (var i = 0; i <= startpoint; i++) {
      x1 = [];
      y1 = [];
      Array.prototype.forEach.call(view.children, (element) => {
        if (element.classList.contains("point")){
          if (element.getAttribute("data-point") == i) {
            x1.push(parseInt(element.style.getPropertyValue("left").slice(0, -2)));
            y1.push(parseInt(element.style.getPropertyValue("top").slice(0, -2)));
            lineTitle = element.getAttribute("title");
          }
        }
      });
      Array.prototype.forEach.call(view.children, (element) => {
        if (element.classList.contains("line")){
          if (element.getAttribute("data-point") == i) {
            element.setAttribute("title", lineTitle);
            var xMid = (x1[0] + x1[1]) / 2 + 10;
            var yMid = (y1[0] + y1[1]) / 2 + 5;
            
            var distance = Math.sqrt( ((x1[0] - x1[1]) * (x1[0] - x1[1])) + ((y1[0] - y1[1]) * (y1[0] - y1[1])));
            element.style.setProperty('width', distance + 'px');

            element.style.setProperty('left', xMid - (distance / 2) + 'px');
            element.style.setProperty('top', yMid + 'px');

            salopeInRadian = Math.atan2(y1[0] - y1[1], x1[0] - x1[1]);
            salopeInDegrees = (salopeInRadian * 180) / Math.PI;
            element.style.setProperty('transform', "rotate(" + salopeInDegrees + "deg)");
          }
        }
      });
    }
  }, 20);
});

/*  ENABLE CORS */
var instance = axios.create({
  baseURL: 'http://localhost:54690/api',
  timeout: 1000,
  headers: { 
   'Accept': 'application/json',
   'Content-Type': 'application/json',
   'Access-Control-Allow-Origin': '*'
  }
});

/*  LOAD CSS  */
fetch('devices.css')
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  document.getElementById("dynamic-style").innerText = response.text();
  return response.text();
})
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('There has been a problem with your fetch operation:', error);
});