import Shortcuts from './shortcut';
import Logger from './logger';
import { showErrorMessage, showSuccessMessage, showConfirmationMessage, showTimedMessage, getBaseUrl } from './utils';

const COMMAND_SET = 'Command set successfully';
const COMMAND_ERROR = 'Looks like there is some error in the script or the html has been changed';

const showUrl = (url) => {
  // open in same tab
  window.open(url, '_self');
};

const lookForSelector = (selector, timeoutDuration = 2000) =>
  new Promise((resolve) => {
    let timeoutExpired = false;
    const timeout = setTimeout(() => { timeoutExpired = true; }, timeoutDuration);
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element || timeoutExpired) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(element);
      }
    }, 200);
  });

const executeSelector = async ({ sequenceIndex, sequence }) => {
  const element = await lookForSelector(sequence[sequenceIndex]);
  if (element === null) {
    showErrorMessage(COMMAND_ERROR);
  } else {
    chrome.runtime.sendMessage({ type: 'execute', sequence, sequenceIndex: sequenceIndex + 1 });
  }
  element.click();
};

const lookInLocalStorage = (baseUrl, key) => {
  chrome.storage.local.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts;
    if (shortcuts && shortcuts[baseUrl] && shortcuts[baseUrl][key]) {
      if (shortcuts[baseUrl][key].sequence) {
        chrome.runtime.sendMessage({ type: 'execute', sequence: shortcuts[baseUrl][key].sequence, sequenceIndex: 0 });
      } else {
        showUrl(shortcuts[baseUrl][key].url);
      }
    }
  });
};

const saveToLocalStorage = (baseUrl, url, key, description, sequence) => {
  // Save it using the Chrome extension storage API.
  chrome.storage.local.get('shortcuts', (result) => {
    let shortcuts = result.shortcuts;
    if (shortcuts && {}.hasOwnProperty.call(shortcuts, baseUrl)) {
      if (shortcuts[baseUrl][key]) {
        showConfirmationMessage('Shortcut already exist', 'Do you want to update it?', () => {
          shortcuts[baseUrl][key] = { url, description, sequence };
          chrome.storage.local.set({ shortcuts }, () => {
            // Notify that we saved.
            showSuccessMessage(COMMAND_SET);
          });
        });
        return;
      }
      shortcuts[baseUrl][key] = { url, description, sequence };
    } else {
      const keyObj = {};
      keyObj[key] = { url, description, sequence };
      if (!shortcuts) {
        shortcuts = {};
      }
      shortcuts[baseUrl] = keyObj;
    }
    chrome.storage.local.set({ shortcuts }, () => {
      // Notify that we saved.
      showSuccessMessage(COMMAND_SET);
    });
  });
};

const saveUrlCommand = (request) => {
  const baseUrl = getBaseUrl(request.url);
  const key = request.key;
  const description = request.description;
  saveToLocalStorage(baseUrl, request.url, key, description);
};

const saveSequence = (request) => {
  const baseUrl = getBaseUrl(request.refUrl);
  const key = request.key;
  const description = request.description;
  saveToLocalStorage(baseUrl, request.refUrl, key, description, request.selectors);
};

const performAction = ({ url, key }) => {
  Logger.log(`Contentscript has received a message from from background script: '${url}' and key: ${key}`);

  const regexp = /https?:\/\/([^/#]+)/gi;
  const match = regexp.exec(url);
  const domain = match[1].toLowerCase();
  Logger.log(`logging domain: ${domain}`);

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
      try {
        // Perform the predefined set of instructions
        domainJson[key].perform();
      } catch (err) {
        showErrorMessage(COMMAND_ERROR);
      }
    }
  } else {
    Logger.log('Searching in local storage');
    lookInLocalStorage(domain, key);
  }
};

/*
 * Action handler for different actions
 */
const onUrlReceive = (request) => {
  if (request.action) {
    if (request.action === 'save_url') {
      saveUrlCommand(request);
    } else if (request.action === 'perform') {
      performAction(request);
    } else if (request.action === 'save_recording') {
      saveSequence(request);
    } else if (request.action === 'error') {
      showTimedMessage(request.message);
    } else if (request.action === 'execute_command') {
      executeSelector(request);
    }
  }
};

export default { onUrlReceive };
