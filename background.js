function main() {
  console.log("main run");
  let notificationId = "";
  let listenersSet = false;
  chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.onMessageExternal.addListener((videoUrl) => {
      if (!listenersSet) {
        setListeners(videoUrl);
        listenersSet = true;
      }
      showNotification("Подтвердите действие");
    });
  });
}
main();

function showNotification(message) {
  console.log("showNotification fired");
  chrome.notifications.create({
    buttons: [
      {
        title: "Ok"
      },
      {
        title: "Cancel"
      }
    ],
    message,
    iconUrl: "images/get_started16.png",
    requireInteraction: true,
    title: "Подтвердите",
    type: "basic"
  },
  id => notificationId = id);
}

function setListeners(videoUrl) {
  chrome.notifications.onButtonClicked.addListener(async (nId, btnId) => {
    if (nId === notificationId && btnId === 0) {
      // send to electron app
      console.log("msg sent to content script", videoUrl);
      sendVideo(videoUrl);
    }
  });
  setListeners = null;
}

async function sendVideo(videoUrl) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id, {name: "video"});
    port.postMessage(videoUrl);
    port.onMessage.addListener((msg) => {
      console.log(msg);
    });
  });
}

