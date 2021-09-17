chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {

    if ("WebSocket" in window) {
      let ws;
      try {
        ws = new WebSocket("ws://127.0.0.1:9000");
      } catch (error) {
        alert(error.message);
      }
      ws.onopen = (e) => {
        const videoBlob = new Blob([msg.video], {type: "video/webm"});
        ws.send(videoBlob);
        download(videoBlob);
      }

      ws.onmessage = (msg) => {
        console.log(msg.data);
        port.postMessage(msg.data);
      }
    }
    else {
      alert("Вебсокеты не поддерживаются Вашим браузером");
    }
  });
});
function download(blob) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}