import React from 'react';
import { FormGroup, ControlLabel, FormControl, Glyphicon } from 'react-bootstrap';

export default class ShortcutItem extends React.Component {

  constructor() {
    super();
    this.state = {
      showSaveIcon: false,
    }
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange() {
    if (!this.state.showSaveIcon) {
      this.setState({ showSaveIcon: true });
    }
  }

  onSave() {
    this.props.onUpdateClick(this.props.base, this.props.shortcut, this.shortcutInput.value);
  }

  render() {
    const { shortcut, title, base, onRemoveClick } = this.props;
    const { showSaveIcon } = this.state;
    return (
    <FormGroup>
      <ControlLabel>{title}</ControlLabel>
      <FormControl
        inputRef={(shortcutInput) => { this.shortcutInput = shortcutInput; }}
        onChange={this.onChange}
        type="text"
        maxLength={10}
        defaultValue={shortcut}
        placeholder="Press key for shortcut"
      />
      { showSaveIcon && <div onClick={this.onSave}><Glyphicon bsClass="glyphicon" glyph="ok" /></div> }
      <div onClick={() => onRemoveClick(base, shortcut)}><Glyphicon bsClass="glyphicon" glyph="remove" /></div>
    </FormGroup>
    );
  }

}
