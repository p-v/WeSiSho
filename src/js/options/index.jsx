import React from 'react';
import { render } from 'react-dom';
import swal from 'sweetalert2';
import Style from './style.css';
import WebShortcuts from './web-shortcuts.jsx';

const WESISHO = 'WeSiSho';
const INVALID_KEY = 'Please enter a valid key';
const LEADER_SAVED = 'Leader key saved';

class Main extends React.Component {

  constructor() {
    super();
    this.onLeaderSave = this.onLeaderSave.bind(this);
  }

  componentDidMount() {
    // configure leader key
    chrome.storage.local.get('leader_key', (res) => {
      if (res) {
        this.leaderInput.value = String.fromCharCode(res.leader_key);
      }
    });
  }

  onLeaderSave() {
    // get leader value
    const leaderVal = this.leaderInput.value;
    const leaderCode = leaderVal && (leaderVal.charCodeAt(0));

    if (leaderCode) {
      chrome.storage.local.set({ leader_key: leaderCode }, () => {
        swal(WESISHO, LEADER_SAVED, 'success');
      });
    } else {
      swal(WESISHO, INVALID_KEY, 'error');
      chrome.storage.local.remove('leader_key', () => {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
      });
    }
  }

  render() {
    return (
      <div>
        <h3>Configure Leader Key:</h3>
        <input
          ref={(leaderInput) => { this.leaderInput = leaderInput; }}
          placeholder="Default ,"
          maxLength={1}
        />
        <button onClick={this.onLeaderSave}>Save</button>
        <WebShortcuts />
      </div>
    );
  }

}

render(
  <Main />,
  document.getElementById('root')
);


/*
const restore_options = () => {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts;
    console.log(shortcuts);
    let idx = 0;
    for (const key in shortcuts) {
      if ({}.hasOwnProperty.call(shortcuts, key)) {
        idx += 1;
        const titleId = `site-${idx}`;
        const contentId = `content-${idx}`;
        const tree = document.querySelector('#tree');
        tree.innerHTML += `<div id="${titleId}" class="sites" data-toggle="collapse" data-target="#${contentId}">${key}</div>`;
        tree.innerHTML += `<div id="${contentId}" class="collapse form-horizontal"></div>`;
        let idxInr = 0
        for (const s in shortcuts[key]) {
          if ({}.hasOwnProperty.call(shortcuts[key], s)) {
            const row = `${shortcuts[key][s].url}`;
            idxInr += 1;
            const removeRowId = `rem-${contentId}-${idxInr}`;
            const editRowId = `edit-${contentId}-${idxInr}`;
            const rowId = `row-${contentId}-${idxInr}`;
            const inputId = `input-${contentId}-${idxInr}`;
            const contentDiv = document.querySelector(`#${contentId}`);
            contentDiv.innerHTML += `<div id="${rowId}" class="form-group"><div for="${editRowId}" class="col-md-4 control-label">${row}</div>
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
}*/
