const restore_options = () => {
  // Use default value color = 'red' and likesColor = true.

  // configure leader key
  const setLeader = document.getElementById('set_leader');
  setLeader.addEventListener('click', () => {
    // get leader value
    const leaderVal = document.getElementById('leader_key').value;
    const leaderCode = leaderVal && (leaderVal.charCodeAt(0));

    if (leaderCode) {
      chrome.storage.local.set({ leader_key: leaderCode }, () => {
        document.getElementById('save_msg').className = 'show-save-msg';
        setTimeout(() => {
          document.getElementById('save_msg').className = 'hide-save-msg';
        }, 2000);
      });
    } else {
      document.getElementById('save_msg').innerText = 'Please enter a vaild key';
      chrome.storage.local.remove('leader_key', () => {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
      });
    }
  });
  chrome.storage.local.get('leader_key', (res) => {
    if (res) {
      const leader = document.getElementById('leader_key');
      leader.value = String.fromCharCode(res.leader_key);
    }
  });

  chrome.storage.local.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts;
    console.log(shortcuts);
    let idx = 0;
    for (const key in shortcuts) {
      if ({}.hasOwnProperty.call(shortcuts, key)) {
        idx += 1;
        const titleId = `site-${idx}`;
        const tree = document.querySelector('#tree');
        tree.innerHTML += `<div id="${titleId}" class="sites" data-toggle="collapse" data-target="#${contentId}">${key}</div>`;
        tree.innerHTML += `<div id="${contentId}" class="collapse form-horizontal"></div>`;
        const contentId = `content-${idx}`;
        let idxInr = 0
        for (const s in shortcuts[key]) {
          if ({}.hasOwnProperty.call(shortcuts[key], s)) {
            const row = `${shortcuts[key][s].url}`;
            idxInr += 1;
            const removeRowId = `rem-${contentId}-${idxInr}`;
            const editRowId = `edit-${contentId}-${idxInr}`;
            const rowId = `row-${contentId}-${idxInr}`;
            const inputId = `input-${contentId}-${idxInr}`;
            document.querySelector(`#${contentId}`) += `<div id="${rowId}" class="form-group"><div for="${editRowId}" class="col-md-4 control-label">${row}</div>
                                      <div class="col-md-2"><input id="${inputId}" class="form-control" maxlength="1" placeholder="Press key for shortcut" type="text" value="${s}">
                                      </div>  <div id="${removeRowId}" class="glyphicon glyphicon-remove modifier col-md-1 cross-icon" aria-hidden="true"></div></div>`;
            document.querySelector(`#${removeRowId}`).click(() => {
              let deleteKey = false;
              if ($(`#${contentId}`).children().length === 1) {
                $(`#${titleId}`).remove();
                deleteKey = true;
              }
              $(`#${rowId}`).remove();
              chrome.storage.local.get('shortcuts', (result) => {
                const shortcuts = result.shortcuts;
                if (deleteKey) {
                  delete shortcuts[key];
                } else {
                  delete shortcuts[key][s];
                }
                // update local storage
                chrome.storage.local.set({ shortcuts }, () => {
                  // Notify that we saved.
                  window.alert('Settings saved');
                });
              });
            });
            $(`#${inputId}`).on('input',(e) => {
              const saveId = `save-${contentId}-${idxInr}`;
              if (!$(`#${saveId}`).length) {
                $(`#${rowId}`).append(`<span id="${saveId}" class="glyphicon glyphicon-ok modifier col-md-1" aria-hidden="true"></span>`);
                $(`#${saveId}`).click(() =>{
                  const newShortcut = $(`#${inputId}`).val();
                  chrome.storage.local.get('shortcuts', (result) => {
                    const shortcuts = result.shortcuts;
                    shortcuts[key][newShortcut] = shortcuts[key][s];
                    delete shortcuts[key][s];
                    // update local storage
                    chrome.storage.local.set({ shortcuts }, () => {
                      // Notify that we saved.
                      window.alert('Settings saved');
                    });
                  });
                });
              }
            });
          }
        }
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
