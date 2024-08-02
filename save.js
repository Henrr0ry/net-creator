async function save() {
    const canvasDiv = document.getElementById('canvas');
    const htmlString = canvasDiv.outerHTML;

    const styleElement = document.getElementById('dynamic-style');
    const cssString = styleElement ? styleElement.textContent : '';

    var a = document.createElement("a");
    var bl = new Blob([htmlString + "<style>" + cssString + "</style>"], {type: "text/html"});
    a.href = URL.createObjectURL(bl);
    a.download = "network.html";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "download";
    a.click();
}

function load() {
    const input = document.getElementById('fileInput');
    var canvasDiv = document.getElementById("canvas");

    if (input.files.length === 0) {
        alert('No file is choosen!');
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        document.getElementById('main-container').innerHTML = content;
        setTimeout( () => {
        Array.prototype.forEach.call(document.getElementById('main-container').children, element => {
            if (element.tagName.toLowerCase() === 'style') {
                element.remove();
            }
        });
        Array.prototype.forEach.call(canvasDiv.children, element => {
            if (element.classList.contains("device") || element.classList.contains('label') || element.classList.contains('point')) {
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', element.outerHTML);
              })
              element.addEventListener('dragend', (e) => {
                element.remove();
              })
            }
        })
        canvasDiv.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        let startpoint = 0;

        canvasDiv.addEventListener('drop', (e) => {
          e.preventDefault();
          const deviceHTML = e.dataTransfer.getData('text');
          const parser = new DOMParser();
          const droppedElement = parser.parseFromString(deviceHTML, "text/html").body.children[0];
          droppedElement.draggable = true;
          const rect = canvasDiv.getBoundingClientRect();
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
          canvasDiv.appendChild(droppedElement);
        
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
              Array.prototype.forEach.call(canvasDiv.children, (element) => {
                if (element.classList.contains('point')) {
                  if (element.getAttribute("data-point") == startpoint)
                    temp += 1;
                }});
              if (temp >= 2) {
                var line = document.createElement("div");
                line.setAttribute("data-point", startpoint);
                line.classList.add("line");
                line.draggable = false;
                canvasDiv.appendChild(line);
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
              Array.prototype.forEach.call(canvasDiv.children, (element) => {
                if (element.classList.contains("point")){
                  if (element.getAttribute("data-point") == i) {
                    x1.push(parseInt(element.style.getPropertyValue("left").slice(0, -2)));
                    y1.push(parseInt(element.style.getPropertyValue("top").slice(0, -2)));
                    lineTitle = element.getAttribute("title");
                  }
                }
              });
              Array.prototype.forEach.call(canvasDiv.children, (element) => {
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
        }, 1000)
    };

    reader.onerror = function(event) {
        console.error('Error: ', event);
    };
    reader.readAsText(file);
}