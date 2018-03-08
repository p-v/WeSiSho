import React from 'react';
import { sites } from './style.css';
import ShortcutItem from './shortcut-item.jsx';

export default class WebShortcutGroup extends React.Component {

  constructor() {
    super();
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

    const rows = Object.keys(shortcuts)
    .map(shortcut =>
      <ShortcutItem
        key={shortcut}
        shortcut={shortcut}
        title={shortcuts[shortcut].url}
        base={base}
        onRemoveClick={onRemoveClick}
        onUpdateClick={onUpdateClick}
      />
    );


    return (
      <div onClick={this.toggleItem}>
        <h3>{base}</h3>
        <hr />
        {rows}
      </div>
    );
  }

}

