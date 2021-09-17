chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {

    if ("WebSocket" in window) {
      const ws = new WebSocket("ws://127.0.0.1:9000");
      ws.onopen = (e) => {
        const videoBlob = new Blob([msg.video], {type: "video/webm"});
        ws.send(videoBlob);
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