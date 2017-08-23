import swal from 'sweetalert2';
import Shortcuts from './shortcut';
import Logger from './logger';

const WESISHO = 'WeSiSho';
const COMMAND_SET = 'Command set successfully';

const showUrl = (url) => {
  // open in same tab
  window.open(url, '_self');
};

const lookInLocalStorage = (baseUrl, url, key) => {
  chrome.storage.local.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts;
    if (shortcuts && shortcuts[baseUrl] && shortcuts[baseUrl][key]) {
      showUrl(shortcuts[baseUrl][key].url);
    }
  });
};

const saveToLocalStorage = (baseUrl, url, key) => {
  // Save it using the Chrome extension storage API.
  chrome.storage.local.get('shortcuts', (result) => {
    let shortcuts = result.shortcuts;
    if (shortcuts && {}.hasOwnProperty.call(shortcuts, baseUrl)) {
      shortcuts[baseUrl][key] = { url };
    } else {
      const keyObj = {};
      keyObj[key] = { url };
      if (!shortcuts) {
        shortcuts = {};
      }
      shortcuts[baseUrl] = keyObj;
    }
    chrome.storage.local.set({ shortcuts }, () => {
      // Notify that we saved.
      swal(WESISHO, COMMAND_SET, 'success');
    });
  });
};

const saveUrlCommand = (request) => {
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
  if (globalKeys[key]) {
    const type = globalKeys[key].type;
    if (type === 'home') {
      // open home page for the domain
      showUrl(`http://${domain}`);
    }
  } else if (Shortcuts[domain] && Shortcuts[domain][key]) {
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

/*
 * Action handler for different actions
 */
const onUrlReceive = (request) => {
  if (request.action) {
    if (request.action === 'save_url') {
      saveUrlCommand(request);
    } else if (request.action === 'record') {
      Logger.log('Record:');
    } else if (request.action === 'perform') {
      performAction(request);
    }
  }
};

export default { onUrlReceive };
