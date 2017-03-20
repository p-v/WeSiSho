import Shortcuts from './shortcut';
import Logger from './logger';

const showUrl = (url) => {
  // open in same tab
  window.open(url, '_self');
};

const lookInLocalStorage = (baseUrl, url, key) => {
  chrome.storage.local.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts;
    Logger.log(shortcuts);
    if (shortcuts && {}.hasOwnProperty.call(shortcuts, baseUrl)) {
      if ({}.hasOwnProperty.call(shortcuts[baseUrl], key)) {
        showUrl(shortcuts[baseUrl][key].url);
      }
    }
  });
};

const saveToLocalStorage = (baseUrl, url, key) => {
  // Save it using the Chrome extension storage API.
  chrome.storage.local.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts;
    Logger.log(shortcuts);
    if (shortcuts && {}.hasOwnProperty.call(shortcuts, baseUrl)) {
      shortcuts[baseUrl][key] = { url };
      chrome.storage.local.set({ shortcuts }, () => {
        // Notify that we saved.
        window.alert('Settings saved');
      });
    } else {
      const keyObj = {};
      keyObj[key] = { url };
      let obj = shortcuts;
      if (!shortcuts) {
        obj = {};
      }
      obj[baseUrl] = keyObj;
      chrome.storage.local.set({ shortcuts: obj }, () => {
        // Notify that we saved.
        window.alert('Settings saved');
      });
    }
  });
};

const saveUrl = (request) => {
  window.alert('Save Url');
  const regexp = /https?:\/\/([^/#]+)/gi;
  const baseUrl = regexp.exec(request.url)[1].toLowerCase();
  const key = request.key;
  saveToLocalStorage(baseUrl, request.url, key);
};

const performAction = (request) => {
  Logger.log(`Contentscript has received a message from from background script: '${request.url}' and key: ${request.key}`);

  const url = request.url;
  const regexp = /https?:\/\/([^/#]+)/gi;
  const match = regexp.exec(url);
  const domain = match[1].toLowerCase();
  Logger.log(`logging domain: ${domain}`);
  const key = request.key;

  // Check in global variables
  const globalKeys = Shortcuts.global;
  // Check if global keys contains key
  if ({}.hasOwnProperty.call(globalKeys, key)) {
    const type = globalKeys[key].type;
    if (type === 'home') {
      // open home page for the domain
      showUrl(`http://${domain}`);
    }
  } else if ({}.hasOwnProperty.call(Shortcuts, domain) &&
             {}.hasOwnProperty.call(Shortcuts[domain], key)) {
    const domainJson = Shortcuts[domain];
    // check for the key
    const type = domainJson[key].type;
    if (type === 'url') {
      // Get the url when the type is url
      const openUrl = domainJson[key].perform;
      showUrl(openUrl);
    } else {
      // Perform the predefined set of instructions
      domainJson[key].perform();
    }
  } else {
    Logger.log('Searching in local storage');
    lookInLocalStorage(domain, request.url, key);
  }
};

// eslint-disable-next-line no-unused-vars
const onUrlReceive = (request, sender) => {
  if (request.action) {
    if (request.action === 'save_url') {
      saveUrl(request);
    } else if (request.action === 'record') {
      console.log('Record:');
    } else if (request.action === 'perform') {
      performAction(request);
    }
  }
};


export default { onUrlReceive };
