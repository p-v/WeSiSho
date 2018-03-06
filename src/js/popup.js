const addClickListeners = () => {
  document.getElementById('url').addEventListener('click', () => {
    // to do add url to chrome extension database
    if ($('#saveUrlDiv').length === 0) {
      $('#url').after('<div id=\'saveUrlDiv\'><input id=\'short_char\' class=\'form-control\' maxlength=\'10\' placeholder=\'Press key for shortcut\' type=\'text\' name=\'abc\'><lable><button id=\'urlSave\' class=\'btn btn-default\'>Save</button></div>');
     
      $('#urlSave').click(() => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          const url = tabs[0].url;
          const key = document.getElementById('short_char').value;
          chrome.tabs.sendMessage(tabs[0].id, { action: 'save_url', url, key });
        });
        // window.close();
      });
    }
    $('input')[0].focus();
  });

  chrome.tabs.onActivated.addListener(function(tabId,windowId) {
    chrome.storage.local.remove('record',  () => {
      document.getElementById('recKey').innerText = 'Record';
    }); 
  });

  // check the recording status
  chrome.storage.local.get('record', (res) =>{
    recButton = res && res.record;
    if (recButton) {
      document.getElementById('recKey').innerText = "Recording... Press to stop...";
    }
    else{
      document.getElementById('recKey').innerText = "Record";
    }
  });

  // When record key is pressed
  document.getElementById('recKey').addEventListener('click', () => {
    // to do add url to chrome extension database
    // start recording
    // set flag in local storage that record key is pressed
    chrome.storage.local.get('record', (res) =>{
      recButton = res && res.record;
      if (!recButton) {
        const record = {
          id: Date.now(),
          links: [],
        };
        chrome.storage.local.set({ record },  () => {
          document.getElementById('recKey').innerText = "Recording... Press to stop...";
        });
      } else {
        console.log(res.record);
        chrome.storage.local.remove('record',  () => {
          document.getElementById('recKey').innerText = 'Record';
        });       
      }
    });

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
    //window.alert('Coming soon');
  //});
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
  };

  /*
     chrome.storage.local.set({ "phasersTo": "awesome" }, function(){
  // Notify that we saved.
  message('Settings saved');
  });*/
});



document.addEventListener('DOMContentLoaded', () => {
  addClickListeners();
});


