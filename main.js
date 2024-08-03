let list = document.getElementById("list");
let list2 = document.getElementById("list2");
let canvas = document.getElementById("canvas")
let x1 = [];
let y1 = [];
let lineTitle = "";
let tempbase64 = "";

let deviceArr = ["internet", "router", "wireless-router", "switch", "pc", "laptop", "pc-allin", "pc-old", "phone", "printer", "server", "nas"]

async function RespawnObjects() {
  for (var i = 0; i < deviceArr.length; i++) {
    var deviceDiv = document.createElement('div');
    deviceDiv.className = 'device';
    var img = document.createElement('img');
    await getBase64Image("icons/" + deviceArr[i] + ".png").then(base64 => {
      tempbase64 = base64;
      //console.log(base64);
    }).catch(err => {
      console.error(err);
    });
    img.src = tempbase64;
    img.title = deviceArr[i];
    img.draggable = false;
    deviceDiv.appendChild(img);
    deviceDiv.draggable = true;
    deviceDiv.setAttribute("data-movex", 32)
    deviceDiv.setAttribute("data-movey", 32)
    list.appendChild(deviceDiv);
  }
}

//GET BASE64
function getBase64Image(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.blob();
    })
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject; 
        reader.readAsDataURL(blob);
      });
    });
}
/*
// FUNCTION TO GET DATA
getBase64Image("icons/" + deviceArr[i] + ".png").then(base64 => {
      console.log(base64); // Zobrazí Base64 výstup
    }).catch(err => {
      console.error(err);
    })
*/

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
setTimeout( () => {
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

  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
}, 1500);

let startpoint = 0;

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const deviceHTML = e.dataTransfer.getData('text');
  const parser = new DOMParser();
  const droppedElement = parser.parseFromString(deviceHTML, "text/html").body.children[0];
  droppedElement.draggable = true;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - droppedElement.getAttribute('data-movex');
  const y = e.clientY - droppedElement.getAttribute('data-movey');
  droppedElement.style.position = 'absolute';
  droppedElement.style.top = `${y}px`;
  droppedElement.style.left = `${x}px`;

  //label update
  if (droppedElement.classList.contains("label")) {
    droppedElement.addEventListener('input', (event) => {
        const currentText = event.target.value;

        for (const child of droppedElement.children) {
            if (child.nodeName === "INPUT") {
                child.placeholder = currentText;
            }
        }
    });
  }

  //element update
  canvas.appendChild(droppedElement);

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
      canvas.setAttribute("data-startpoint", String(startpoint + 1));

      var temp = 0;
      Array.prototype.forEach.call(canvas.children, (element) => {
        if (element.classList.contains('point')) {
          if (element.getAttribute("data-point") == startpoint)
            temp += 1;
        }});
      if (temp >= 2) {
        var line = document.createElement("div");
        line.setAttribute("data-point", startpoint);
        line.classList.add("line");
        line.draggable = false;
        canvas.appendChild(line);
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
      Array.prototype.forEach.call(canvas.children, (element) => {
        if (element.classList.contains("point")){
          if (element.getAttribute("data-point") == i) {
            x1.push(parseInt(element.style.getPropertyValue("left").slice(0, -2)));
            y1.push(parseInt(element.style.getPropertyValue("top").slice(0, -2)));
            lineTitle = element.getAttribute("title");
          }
        }
      });
      Array.prototype.forEach.call(canvas.children, (element) => {
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
  }, 50);
});

/*  LOAD CSS  */
fetch('devices.css')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
    document.getElementById("dynamic-style").innerText = data;
    //console.log(data);
  })
  .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
  });


//  LOAD CANVAS
canvas.style.width = String(window.innerWidth - 30) + "px";
canvas.style.height = String(window.innerHeight - 190) + "px";

var canvas_width = document.getElementById("canvas-width");
var canvas_height = document.getElementById("canvas-height");

canvas_width.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      const size = canvas_width.value;
      if (size) {
          canvas.style.width = `${size}px`;
      }
  }
});

canvas_height.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      const size = canvas_height.value;
      if (size) {
          canvas.style.height = `${size}px`;
      }
  }
});