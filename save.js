async function save() {
    const viewDiv = document.getElementById('view');
    const htmlString = viewDiv.outerHTML;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'devices.css', true);
    xhr.onload = function() {
    if (xhr.status === 200) {
        console.log(xhr.responseText);
    }
    };
    xhr.send();

    var htmlContent = [htmlString + "<style>" + xhr + "</style>"];
    var a = document.createElement("a");
    var bl = new Blob(htmlContent, {type: "text/html"});
    a.href = URL.createObjectURL(bl);
    a.download = "network.html";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "download";
    a.click();
}