import React from 'react';
import { render } from 'react-dom';
import '../../css/wesisho.global.css';
import { shortcutInput, shortcutDescription, saveButton, optionContainer, cancelButton } from './style.css';

const SHORTCUT_EMPTY = 'Oops! Looks like no shortcut has been set';

class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      addShortcut: false,
      createShortcut: false,
      recording: false,
      selectors: [],
    };
    this.onAddButtonClick = this.onAddButtonClick.bind(this);
    this.onSaveShortcutClick = this.onSaveShortcutClick.bind(this);
    this.onSaveRecordingClick = this.onSaveRecordingClick.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.onCreateShortcutClick = this.onCreateShortcutClick.bind(this);
    this.onCancelSaveShortcutClick = this.onCancelSaveShortcutClick.bind(this);
    this.onRefUrlChange = this.onRefUrlChange.bind(this);
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

    const keyValue = this.shortcutInput.value;
    const description = this.shortcutDescInput.value;

    if (!keyValue) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'error', message: SHORTCUT_EMPTY });
      });
      return;
    }

    window.close(); // Close extension popup

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const key = keyValue;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'save_url', url, key, description });
    });
  }

  onSaveRecordingClick() {
    const key = this.shortcutInput.value;
    const description = this.shortcutDescInput.value;

    if (!key) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'error', message: SHORTCUT_EMPTY });
      });
      return;
    }

    const { refUrl, selectors } = this.state;

    this.setState({
      addShortcut: false,
      createShortcut: false,
      recording: false,
      selectors: [],
      refUrl: undefined,
    });

    window.close(); // Close extension popup

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'save_recording', key, description, refUrl, selectors });
    });
  }

  onRecordClick() {
    this.setState({ recording: !this.state.recording });

    if (!this.state.recording) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const url = tabs[0].url;
        chrome.storage.local.set({ recording: true, refUrl: url, activeRecording: [] });
      });
    } else {
      // Fetch the active recording and append the current selector
      chrome.storage.local.get(['activeRecording', 'refUrl'], (recRes) => {
        // Clear recording
        chrome.storage.local.set({ recording: false, activeRecording: [] });

        const activeRecording = recRes && recRes.activeRecording;
        if (activeRecording && activeRecording.length > 0) {
          this.setState({ selectors: activeRecording, refUrl: recRes.refUrl });
        }
      });
    }
  }

  onCreateShortcutClick() {
    this.setState({ createShortcut: true });
  }

  onCancelSaveShortcutClick() {
    this.setState({ createShortcut: false, selectors: [], refUrl: undefined });
  }

  onRefUrlChange(e) {
    this.setState({ refUrl: e.target.value });
  }

  renderView() {
    const { createShortcut, recording, selectors, refUrl } = this.state;

    if (selectors.length > 0) {
      const selectorRows = selectors.map((selector, idx) =>
        <div key={idx}>{selector}</div>
       );

      return (
        <div>
          <h3>{'Save following sequence?'}</h3>
          {selectorRows}
          <input
            ref={(refUrlInput) => { this.refUrlInput = refUrlInput; }}
            type="text"
            className={shortcutInput}
            placeholder="Reference page"
            autoFocus
            onChange={this.onRefUrlChange}
            value={refUrl}
          />
          <input
            ref={(shortcutInputV) => { this.shortcutInput = shortcutInputV; }}
            type="text"
            maxLength={10}
            className={shortcutInput}
            placeholder="Set shortcut for the sequence"
            autoFocus
          />
          <textarea
            ref={(shortcutDescInput) => { this.shortcutDescInput = shortcutDescInput; }}
            className={shortcutDescription}
            type="text"
            placeholder="Add description for the sequence"
          />
          <button className={saveButton} onClick={this.onSaveRecordingClick}>{'Save'}</button>
          <button className={cancelButton} onClick={this.onCancelSaveShortcutClick}>{'Cancel'}</button>
        </div>
      );
    }

    if (!createShortcut) {
      return (
        <div className={optionContainer}>
          <button onClick={this.onRecordClick}>{recording ? 'Stop Recording' : 'Record'}</button>
          { !recording && <button onClick={this.onCreateShortcutClick}>{'Create Shortcut'}</button> }
        </div>
      );
    }

    return (
      <div>
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
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderView()}
      </div>
    );
  }
}

render(
  <Main />,
  document.getElementById('root')
);
