chrome.runtime.onConnect.addListener((port) => {
  console.log("port", port);
  port.onMessage.addListener((videoUrl) => {
    console.log("get videoUrl from background script", videoUrl);
    if ("WebSocket" in window) {
      let ws;
      try {
        console.log("open websocket", ws);
        ws = new WebSocket("ws://127.0.0.1:9000");
      } catch (error) {
        alert(error.message);
      }
      ws.onopen = async (e) => {
        //download(msg.video);
        const videoBlob = await fetch(videoUrl).then(res => res.blob());
        console.log("fetched video blob", videoBlob);
        ws.send(videoBlob);
      }

      ws.onmessage = (msg) => {
        console.log("received from server", msg);
        //port.postMessage(msg.data);
        download(msg.data);
      }
    }
    else {
      alert("Вебсокеты не поддерживаются Вашим браузером");
    }
  });
});
function download(blob) {
  url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.avi";
  a.click();
  window.URL.revokeObjectURL(url);
}