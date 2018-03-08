import React from 'react';
import { FormGroup, ControlLabel, FormControl, Button, Glyphicon } from 'react-bootstrap';
import { sites } from './style.css';

const ShortcutItem = ({ shortcut, title, base, onRemoveClick }) =>
  (
    <FormGroup>
      <ControlLabel>{title}</ControlLabel>
      <FormControl type="text" maxLength={1} defaultValue={shortcut} placeholder="Press key for shortcut" />
      <div onClick={() => onRemoveClick(base, shortcut)}><Glyphicon bsClass="glyphicon" glyph="remove" /></div>
    </FormGroup>
  )


export default class WebShortcutGroup extends React.Component {

  constructor() {
    super();
    this.state = {
      expanded: false,
    }
    this.toggleItem = this.toggleItem.bind(this);
  }

  toggleItem() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { base, shortcuts, onRemoveClick } = this.props;

    const rows = Object.keys(shortcuts)
    .map(shortcut =>
      <ShortcutItem
        key={shortcut}
        shortcut={shortcut}
        title={shortcuts[shortcut].url}
        base={base}
        onRemoveClick={onRemoveClick}
      />
    );


    return (
      <div onClick={this.toggleItem}>
        <div className={sites}>{base}</div>
        {rows}
      </div>
    );
  }

}

