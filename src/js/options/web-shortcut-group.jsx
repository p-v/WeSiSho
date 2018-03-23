import React from 'react';
import { sites, arrowUp, arrowDown, groupContainer } from './style.css';
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
      <div className={groupContainer} onClick={this.toggleItem}>
        <h3>{base}</h3>
        <div className={expanded ? arrowUp: arrowDown} />
        <hr />
        {expanded && rows}
      </div>
    );
  }

}

