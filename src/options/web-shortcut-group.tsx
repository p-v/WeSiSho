import React from 'react';
import { arrowUp, arrowDown, groupTitle } from './style.css';
import ShortcutItem from './shortcut-item';

type Shortcut = {
    url: string;
    description: string;
}

export interface ShortcutIndex {
    [key: string]: Shortcut;
}

type WebShortcutGroupProps = {
    base: string;
    shortcuts: ShortcutIndex;
    onRemoveClick: (a: string, b: string) => void
    onUpdateClick: (a: string, b: string, c: string) => void
}

type WebShortcutGroupState = {
    expanded: boolean;
}

export default class WebShortcutGroup extends React.Component<WebShortcutGroupProps, WebShortcutGroupState> {

  constructor(props: WebShortcutGroupProps) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleItem = this.toggleItem.bind(this);
  }

  toggleItem() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { base, shortcuts, onRemoveClick, onUpdateClick } = this.props;
    const { expanded } = this.state;

    const rows = Object.keys(shortcuts)
    .map(shortcut =>
      <ShortcutItem
        key={shortcut}
        shortcut={shortcut}
        title={shortcuts[shortcut].url}
        description={shortcuts[shortcut].description}
        base={base}
        onRemoveClick={onRemoveClick}
        onUpdateClick={onUpdateClick}
      />
    );

    return (
      <div>
        <div className={groupTitle} onClick={this.toggleItem}>
          <h3>{base}</h3>
          <div className={expanded ? arrowUp: arrowDown} />
        </div>
        <hr />
        {expanded && rows}
      </div>
    );
  }

}

