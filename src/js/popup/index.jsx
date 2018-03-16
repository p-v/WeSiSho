import React from 'react';
import { render } from 'react-dom';
import '../../css/wesisho.global.css';
import { shortcutInput, shortcutDescription, saveButton, optionContainer, cancelButton } from './style.css';

class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      addShortcut: false,
      createShortcut: false,
      recording: false,
    };
    this.onAddButtonClick = this.onAddButtonClick.bind(this);
    this.onSaveShortcutClick = this.onSaveShortcutClick.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.onCreateShortcutClick = this.onCreateShortcutClick.bind(this);
    this.onCancelSaveShortcutClick = this.onCancelSaveShortcutClick.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get('recording', (res) => {
      if (res) {
        this.setState({ recording: res.recording });
      }
    });
  }

  onAddButtonClick() {
    this.setState({ addShortcut: true });
  }

  onSaveShortcutClick() {
    this.setState({ addShortcut: false });

    window.close(); // Close extension popup

    const keyValue = this.shortcutInput.value;
    const description = this.shortcutDescInput.value;

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const key = keyValue;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'save_url', url, key, description });
    });
  }

  onRecordClick() {
    this.setState({ recording: !this.state.recording });

    chrome.storage.local.set({ recording: !this.state.recording });
  }

  onCreateShortcutClick() {
    this.setState({ createShortcut: true });
  }

  onCancelSaveShortcutClick() {
    this.setState({ createShortcut: false });
  }

  render() {
    const { createShortcut, recording } = this.state;
    return (
      <div>
        { !createShortcut && <div className={optionContainer}>
          <button onClick={this.onRecordClick}>{recording ? 'Stop Recording' : 'Record'}</button>
          { !recording && <button onClick={this.onCreateShortcutClick}>{'Create Shortcut'}</button> }
        </div> }
        { createShortcut && <div>
          <input
            ref={(shortcutInputV) => { this.shortcutInput = shortcutInputV; }}
            type="text"
            maxLength={10}
            className={shortcutInput}
            placeholder="Set shortcut for page"
            autoFocus
          />
          <textarea
            ref={(shortcutDescInput) => { this.shortcutDescInput = shortcutDescInput; }}
            className={shortcutDescription}
            type="text"
            placeholder="Add description for shortcut"
          />
          <button className={saveButton} onClick={this.onSaveShortcutClick}>{'Save'}</button>
          <button className={cancelButton} onClick={this.onCancelSaveShortcutClick}>{'Cancel'}</button>
        </div> }
      </div>
    );
  }
}

render(
  <Main />,
  document.getElementById('root')
);
