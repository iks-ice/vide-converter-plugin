function main() {
  let notificationId = "";
  chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.onMessageExternal.addListener((req) => {
      setListeners(req);
      showNotification("Подтвердите действие");
    });
  });
}
main();

function showNotification(message) {
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

function setListeners({video}) {
  chrome.notifications.onButtonClicked.addListener(async (nId, btnId) => {
    if (nId === notificationId && btnId === 0) {
      // send to electron app
      sendVideo(video);
    }
  });
}

async function sendVideo(video) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id, {name: "video"});
    port.postMessage({video});
    port.onMessage.addListener((msg) => {
      console.log(msg);
    });
  });
}

