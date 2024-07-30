async function save() {
    const viewDiv = document.getElementById('view');
    const htmlString = viewDiv.outerHTML;

    var a = document.createElement("a");
    var bl = new Blob(htmlString, {type: "text/html"});
    a.href = URL.createObjectURL(bl);
    a.download = "network.html";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "download";
    a.click();
}