import React, {Component} from 'react';
import swal from 'sweetalert2';
import WebShortcutGroup from './web-shortcut-group';
import { shortcutsRoot } from './style.css';
import { showConfirmationMessage } from '../utils';

const WESISHO = 'WeSiSho';
const SETTINGS_SAVED = 'Settings Saved';

export interface Shortcut {
    url: string;
    description: string;
}

export interface ShortcutIndex {
    [key: string]: Shortcut;
}

export interface SiteIndex {
    [key: string]: ShortcutIndex;
}

type WebShortcutsProps = {

}

type WebShortcutsState = {
    showLoader: boolean;
    shortcuts: SiteIndex;
}

export default class WebShortcuts extends Component<WebShortcutsProps, WebShortcutsState> {

    constructor() {
        super({});
        this.state = {
            showLoader: true,
            shortcuts: {},
        };
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onUpdateClick = this.onUpdateClick.bind(this);
    }

    componentDidMount(): void {
        chrome.storage.local.get('shortcuts', (result) => {
            const shortcuts = result.shortcuts;
            this.setState({ shortcuts, showLoader: false });
        });
    }

    updateShortcut(key: string, prevShortcut: string, newShortcut: string, newShortcuts: SiteIndex): void {
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

    onUpdateClick(key: string, prevShortcut: string, newShortcut: string): void {
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

    onRemoveClick(key: string, shortcut: string): void {
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

        if (!shortcuts || Object.keys(shortcuts).length === 0) {
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

