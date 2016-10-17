import Handler from './url-handler'
import Utils from './utils'
import Logger from './logger'

if (window === top) {
	// Add event listener
	window.addEventListener('keydown', (e) => {
		Logger.log("Some key pressed");
		if (e.ctrlKey && e.keyCode !== null){ 
			const key = String.fromCharCode(e.keyCode).toLowerCase();
			chrome.runtime.sendMessage({"key" : key, "shift" : e.shiftKey});
		}
	}, false);
}

chrome.runtime.onMessage.addListener(Handler.onUrlReceive);

document.addEventListener('mousedown', (event) => {
    if(event.button === 2) { 
        let clickedEl = event.target;
        Logger.log(Utils.getPathTo(clickedEl));
    }
}, true);
