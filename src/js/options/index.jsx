import React from 'react';
import { render } from 'react-dom';
import Style from './style.css';
import WebShortcuts from './web-shortcuts.jsx';
import { showErrorMessage, showSuccessMessage } from '../utils';

const INVALID_KEY = 'Please enter a valid key';
const LEADER_SAVED = 'Leader key saved';
const LEADER_TIMEOUT_SAVED = 'Key timeout saved';

const DEFAULT_TIMEOUT = 1000;

class Main extends React.Component {

  constructor() {
    super();
    this.onLeaderSave = this.onLeaderSave.bind(this);
    this.onLeaderTimeoutChange = this.onLeaderTimeoutChange.bind(this);
  }

  componentDidMount() {
    // configure leader key
    chrome.storage.local.get(['leader_key', 'key_timeout'], (res) => {
      if (res) {
        this.leaderInput.value = res.leader_key;
        this.timeoutSelector.value = res.key_timeout || DEFAULT_TIMEOUT;
      }
    });
  }

  onLeaderSave() {
    // get leader value
    const leaderVal = this.leaderInput.value;

    if (leaderVal) {
      chrome.storage.local.set({ leader_key: leaderVal }, () => {
        showSuccessMessage(LEADER_SAVED);
      });
    } else {
      showErrorMessage(INVALID_KEY);
      chrome.storage.local.remove('leader_key', () => {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
      });
    }
  }

  onLeaderTimeoutChange(e) {
    const value = e.target.value;
    chrome.storage.local.set({ key_timeout: Number(value) }, () => {
      showSuccessMessage(LEADER_TIMEOUT_SAVED);
    });
  }

  render() {
    return (
      <div>
        <h2>WeSiSho Options</h2>
        <hr />
        <table>
          <tr>
          <td>
            <h4>Configure Leader Key:</h4>
          </td>
            <td>
              <input
                className={Style.leaderInput}
                ref={(leaderInput) => { this.leaderInput = leaderInput; }}
                type="text"
                placeholder="Default ,"
                maxLength={1}
              />
            </td>
            <td>
              <button onClick={this.onLeaderSave}>
                {'Save'}
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <h4>{'Key timeout:'}</h4>
            </td>
            <td>
              <select
                name="timeinseconds"
                ref={(timeoutSelector) => { this.timeoutSelector = timeoutSelector; }}
                defaultValue={DEFAULT_TIMEOUT}
                onChange={this.onLeaderTimeoutChange}
              >
                <option value="500">{'0.5s'}</option>
                <option value="1000">{'1s'}</option>
                <option value="1500">{'1.5s'}</option>
                <option value="2000">{'2s'}</option>
              </select>
            </td>
          </tr>
        </table>
        <WebShortcuts />
      </div>
    );
  }

}

render(
  <Main />,
  document.getElementById('root')
);
