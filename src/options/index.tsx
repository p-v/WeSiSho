import React, {createRef} from 'react';
import { render } from 'react-dom';
import Style from './style.css'
import WebShortcuts from './web-shortcuts';
import { showErrorMessage, showSuccessMessage } from '../utils';

const INVALID_KEY = 'Please enter a valid key';
const LEADER_SAVED = 'Leader key saved';
const LEADER_TIMEOUT_SAVED = 'Key timeout saved';

const DEFAULT_TIMEOUT = 1000;

class Main extends React.Component {
    private leaderInput = createRef<HTMLInputElement>();
    private timeoutSelector = createRef<HTMLSelectElement>();

    constructor() {
        super({});
        this.onLeaderSave = this.onLeaderSave.bind(this);
        this.onLeaderTimeoutChange = this.onLeaderTimeoutChange.bind(this);
    }

    componentDidMount() {
        // configure leader key
        chrome.storage.local.get(['leader_key', 'key_timeout'], (res) => {
            if (res) {
                const leaderNode = this.leaderInput.current;
                const timeoutNode = this.timeoutSelector.current;

                if (leaderNode) {
                    leaderNode.value = res.leader_key || ',';
                }

                if (timeoutNode) {
                    timeoutNode.value = res.key_timeout || DEFAULT_TIMEOUT;
                }
            }
        });
    }

    onLeaderSave() {
        // get leader value
        const leaderNode = this.leaderInput.current;
        const leaderVal: string|null = leaderNode && leaderNode.value;

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

    onLeaderTimeoutChange(e: React.FormEvent) {
        const target = e.target as HTMLSelectElement;
        const value = target.value;
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
                                ref={this.leaderInput}
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
                                ref={this.timeoutSelector}
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
