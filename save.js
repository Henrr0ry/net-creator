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