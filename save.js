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

    if (input.files.length === 0) {
        alert('No file is choosen!');
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        document.getElementById('main-container').innerHTML = content;
    };

    reader.onloadend = function(event) {
            Array.prototype.forEach.call(document.getElementById('main-container').children, element => {
                if (element.tagName.toLowerCase() === 'style') {
                    element.remove();
                }
            });
            Array.prototype.forEach.call(canvas.children, element => {
                element.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text', element.outerHTML);
                })
                element.addEventListener('dragend', (e) => {
                    element.remove();
                })
            } )
            canvas.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
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
            });
    }

    reader.onerror = function(event) {
        console.error('Error: ', event);
    };
    reader.readAsText(file);
}