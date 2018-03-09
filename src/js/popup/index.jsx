import React from 'react';
import { render } from 'react-dom';
import '../../css/wesisho.global.css';
import { shortcutInput, shortcutDescription, saveButton } from './style.css';

class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      addShortcut: false,
    };
    this.onAddButtonClick = this.onAddButtonClick.bind(this);
    this.onSaveShortcutClick = this.onSaveShortcutClick.bind(this);
  }

  componentDidMount() {
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

  render() {
    return (
      <div>
        <input
          ref={(shortcutInput) => { this.shortcutInput = shortcutInput; }}
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
      </div>
    );
  }
}

render(
  <Main />,
  document.getElementById('root')
);
