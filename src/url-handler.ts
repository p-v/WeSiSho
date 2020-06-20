import Shortcuts from './shortcut';
import Logger from './logger';
import { showErrorMessage, showSuccessMessage, showConfirmationMessage, showTimedMessage, getBaseUrl } from './utils';

type Shortcut = {
    url: string;
    description: string;
    sequence: string[];
}

interface KeyIndex {
    [key: string]: Shortcut
}

type Request = {
    action: string;
    url: string;
    refUrl: string;
    key: string;
    message: string;
    description: string;
    sequenceIndex: number;
    sequence: string[];
    selectors: string[];
}


const COMMAND_SET = 'Command set successfully';
const COMMAND_ERROR = 'Looks like there is some error in the script or the html has been changed';

const showUrl = (url: string): void => {
    // open in same tab
    window.open(url, '_self');
};

const lookForSelector = (selector: string, timeoutDuration = 2000) =>
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

const executeSelector = async ({ sequenceIndex, sequence }: {sequenceIndex: number, sequence: string[]}) => {
    const element = await lookForSelector(sequence[sequenceIndex]);
    if (element === null) {
        showErrorMessage(COMMAND_ERROR);
    } else {
        chrome.runtime.sendMessage({ type: 'execute', sequence, sequenceIndex: sequenceIndex + 1 });
    }
    (<HTMLElement>element).click();
};

const lookInLocalStorage = (baseUrl: string, key: string) => {
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

const saveToLocalStorage = (baseUrl: string, url: string, key: string, description: string, sequence: string[]) => {
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
            const keyObj: KeyIndex = {};
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

const saveUrlCommand = (request: Request) => {
    const baseUrl = getBaseUrl(request.url);
    const key = request.key;
    const description = request.description;
    saveToLocalStorage(baseUrl, request.url, key, description, []);
};

const saveSequence = (request: Request) => {
    const baseUrl = getBaseUrl(request.refUrl);
    const key = request.key;
    const description = request.description;
    saveToLocalStorage(baseUrl, request.refUrl, key, description, request.selectors);
};

const performAction = (request: Request): void => {
    const {url, key} = request;
    Logger.log(`Contentscript has received a message from from background script: '${url}' and key: ${key}`);

    const regexp = /https?:\/\/([^/#]+)/gi;
    const match = regexp.exec(url);

    if (!match || !match[1]) return;

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
            const openUrl = domainJson[key].perform as string;
            showUrl(openUrl);
        } else {
            try {
                // Perform the predefined set of instructions
                (<() => void>domainJson[key].perform)();
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
const onUrlReceive = (request: Request): void => {
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
