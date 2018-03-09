import React from 'react';
import swal from 'sweetalert2';
import WebShortcutGroup from './web-shortcut-group.jsx';
import { shortcutsRoot } from './style.css';
import { showConfirmationMessage } from '../utils';

const WESISHO = 'WeSiSho';
const SETTINGS_SAVED = 'Settings Saved';

export default class WebShortcuts extends React.Component {

  constructor() {
    super();
    this.state = {
      showLoader: true,
      shortcuts: {},
    };
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get('shortcuts', (result) => {
      const shortcuts = result.shortcuts;
      this.setState({ shortcuts, showLoader: false });

      /*
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
    */
    });
  }

  updateShortcut(key, prevShortcut, newShortcut, newShortcuts) {
    newShortcuts[key][newShortcut] = newShortcuts[key][prevShortcut];
    delete newShortcuts[key][prevShortcut];

    this.setState({ shortcuts: newShortcuts });

    chrome.storage.local.get('shortcuts', (result) => {
      const storageShortcuts = result.shortcuts;
      storageShortcuts[key][newShortcut] = storageShortcuts[key][prevShortcut];
      delete storageShortcuts[key][prevShortcut];
      // update local storage
      chrome.storage.local.set({ shortcuts: storageShortcuts }, () => {
        // Notify that we saved.
        swal(WESISHO, SETTINGS_SAVED, 'success');
      });
    });
  }

  onUpdateClick(key, prevShortcut, newShortcut) {
    const { shortcuts } = this.state;

    const newShortcuts = {
      ...shortcuts,
    };

    // Check if shortcut already exist
    if (newShortcuts[key][newShortcut]) {
      showConfirmationMessage('Shortcut already exist', 'Do you want to replace it?', () => {
        delete newShortcuts[key][newShortcut];
        this.updateShortcut(key, prevShortcut, newShortcut, newShortcuts);
      });
    }

    this.updateShortcut(key, prevShortcut, newShortcut, newShortcuts);
  }

  onRemoveClick(key, shortcut) {
    const { shortcuts } = this.state;

    const newShortcuts = {
      ...shortcuts,
    };

    let deleteKey = false;

    if (newShortcuts[key] && Object.values(newShortcuts[key]).length === 1) {
      delete newShortcuts[key];
      deleteKey = true;
    } else {
      delete newShortcuts[key][shortcut];
    }

    this.setState({ shortcuts: newShortcuts });

    chrome.storage.local.get('shortcuts', (result) => {
      const storageShortcuts = result.shortcuts;
      if (deleteKey) {
        delete storageShortcuts[key];
      } else {
        delete storageShortcuts[key][shortcut];
      }

      // update local storage
      chrome.storage.local.set({ shortcuts: storageShortcuts }, () => {
        // Notify that we saved.
        swal(WESISHO, SETTINGS_SAVED, 'success');
      });
    });
  }

  render() {
    const { showLoader, shortcuts } = this.state;
    if (showLoader) {
      return (<h4>Loading...</h4>);
    }

    if (Object.keys(shortcuts).length === 0) {
      return (<h4>{'No web shortcuts set so far'}</h4>);
    }

    const rows = Object.keys(shortcuts)
    .map(shortcut =>
      <WebShortcutGroup
        key={shortcut}
        shortcuts={shortcuts[shortcut]}
        base={shortcut}
        onRemoveClick={this.onRemoveClick}
        onUpdateClick={this.onUpdateClick}
      />
    );

    return (
      <div className={shortcutsRoot}>
        <h4>Configure Shortcuts:</h4>
        {rows}
      </div>
    );
  }

}

