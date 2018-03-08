import React from 'react';
import { render } from 'react-dom';
import { Well, Button, FormControl } from 'react-bootstrap';

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
    const keyValue = this.shortcutInput.value;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const key = keyValue;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'save_url', url, key });
    });
  }

  render() {
    return (
      <div>
        <h5>{'Select Option:'}</h5>
        <Well>
          <Button onClick={this.onAddButtonClick}>{'Add'}</Button>
          { this.state.addShortcut &&
            <div>
              <FormControl
                inputRef={(shortcutInput) => { this.shortcutInput = shortcutInput; }}
                type="text"
                maxLength={10}
                placeholder="Press key for shortcut"
                autoFocus
              />
              <Button onClick={this.onSaveShortcutClick}>{'Save'}</Button>
            </div>
          }
        </Well>
      </div>
    );
  }
}

render(
  <Main />,
  document.getElementById('root')
);
