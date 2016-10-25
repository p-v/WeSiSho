const addClickListeners = () => {
  document.getElementById('url').addEventListener('click', () => {
    // to do add url to chrome extension database
    if ($('#saveUrlDiv').length === 0) {
      $('#url').after('<div id=\'saveUrlDiv\'><input id=\'short_char\' maxlength=\'1\' placeholder=\'Press key for shortcut\' type=\'text\' name=\'abc\'><lable><button id=\'urlSave\'>Save</button></div>');
      $('#urlSave').click(() => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          const url = tabs[0].url;
          const key = document.getElementById('short_char').value;
          chrome.tabs.sendMessage(tabs[0].id, { action: 'save_url', url, key });
        });
        window.close();
      });
    }
    $('input')[0].focus();
  });
  document.getElementById('record').addEventListener('click', () => {
    // to do add url to chrome extension database
    // start recording
    //chrome.tabs.sendMessage(tab.id, {action:'start'}, function(response) {
    //  console.log('Start action sent');
    //});
    /* var recordBtn = document.getElementById("record");
      if (recordBtn.innerHTML === "Record") {
      recordBtn.innerHTML = "Recording... Press to stop...";
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      //var url = tabs[0].url;
      chrome.tabs.sendMessage(tabs[0].id, {"action":"record"});
      });
      } else {
      recordBtn.innerHTML = "Record";
      }*/
    window.alert('Coming soon');
  });
};

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log(`Received a message: ${request.url} and key: ${request.key}`);
  const url = request.url;
  const regexp = /https?:\/\/([^\/#]+)/gi;
  const match = regexp.exec(url);
  const domain = match[1].toLowerCase();
  console.log(`logging domain:${domain}`);
  if (!domain) {
    console.error('Unable to find domain');
    return;
  }

  /*
     chrome.storage.local.set({ "phasersTo": "awesome" }, function(){
  // Notify that we saved.
  message('Settings saved');
  });*/
});


document.addEventListener('DOMContentLoaded', () => {
  addClickListeners();
});
