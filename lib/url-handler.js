import Shortcuts from './shortcut'
import Logger from './logger'

const _lookInLocalStorage = (baseUrl, url, key, useShift) => {
    chrome.storage.local.get("shortcuts", function (result) { 
        let shortcuts = result.shortcuts;
        Logger.log(shortcuts);
        if (shortcuts && shortcuts.hasOwnProperty(baseUrl)) {
            if (shortcuts[baseUrl].hasOwnProperty(key)) {
                let url = shortcuts[baseUrl][key].url;
                if (request.shift) {
                    // open in new tab
                    window.open(url, '_blank');
                } else {
                    // open in same tab
                    window.open(url, '_self');
                }

            }
        }
    });
}

const _saveToLocalStorage = (baseUrl, url, key) => {
    // Save it using the Chrome extension storage API.
    chrome.storage.local.get("shortcuts", function (result) { 
        let shortcuts = result.shortcuts;
        Logger.log(shortcuts);
        if (shortcuts && shortcuts.hasOwnProperty(baseUrl)) {
            shortcuts[baseUrl][key] = {"url" : url}; 
            chrome.storage.local.set({"shortcuts" : shortcuts}, function() {
                // Notify that we saved.
                window.alert('Settings saved');
            });
        } else {
            var keyObj = {};
            keyObj[key] = {"url" : url};
            var obj = result.shortcuts;
            obj[baseUrl] =  keyObj;
            chrome.storage.local.set({"shortcuts" : obj}, function() {
                // Notify that we saved.
                window.alert('Settings saved');
            });
        }
    });

}

const onUrlReceive = (request, sender) => {
    if (request.action) {
        if (request.action === "save_url") {
            saveUrl(request);
        } else if (request.action === "record") {
            window.alert("Record:");
        }
    } else {
        performAction(request);
    }
}

const performAction = (request) => {
    Logger.log("Contentscript has received a message from from background script: '" + 
                request.url + "' and key" + request.key);

    let url = request.url;
    const regexp = /https?:\/\/([^\/#]+)/gi;
    let match = regexp.exec(url);
    let domain = match[1].toLowerCase();
    Logger.log("logging domain:" + domain);
    var key = request.key;

    // Check in global variables
    let globalKeys = Shortcuts.global;
    // Check if global keys contains key
    if (globalKeys.hasOwnProperty(key)) {
        const type = globalKeys[key].type;
        if (type === "home") {
            // open home page for the domain
            if (request.shift) {
                // open in new tab
                window.open('http://' + domain, '_blank');
            } else {
                // open in same tab
                window.open('http://' + domain, '_self');
            }
        }
    } else {

        if (Shortcuts.hasOwnProperty(domain)) {
            // load domain json object
            let domainJson = Shortcuts[domain];
            // check for the key
            if (domainJson.hasOwnProperty(key)) {
                const type = domainJson[key].type;
                if (type === "url") {
                    // Get the url when the type is url
                    let openUrl = domainJson[key].perform;
                    if (request.shift) {
                        // open in new tab
                        window.open(openUrl, '_blank');
                    } else {
                        // open in same tab
                        window.open(openUrl, '_self');
                    }
                } else {
                    // Perform the predefined set of instructions
                    domainJson[key].perform();
                }
            }
        } else {
            Logger.log("Searching in local storage");
            _lookInLocalStorage(domain, request.url, key, request.shift);
        }

    }
}

const saveUrl = (request) => {
    window.alert("Save Url");
    let regexp = /https?:\/\/([^\/#]+)/gi;
    let baseUrl = regexp.exec(request.url)[1].toLowerCase();
    let key = request.key;
    _saveToLocalStorage(baseUrl, request.url, key);
}

export default { onUrlReceive, performAction }
