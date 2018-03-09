import React from 'react';
import { icon } from './style.css';

export default class ShortcutItem extends React.Component {

  constructor() {
    super();
    this.state = {
      showSaveIcon: false,
    };
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
    const { shortcut, title, description, base, onRemoveClick } = this.props;
    const { showSaveIcon } = this.state;

    const displayTitle = description ? `${description} (${title})` : title;
    return (
    <div>
      <h5>{displayTitle}</h5>
      <input
        ref={(shortcutInput) => { this.shortcutInput = shortcutInput; }}
        onChange={this.onChange}
        type="text"
        maxLength={10}
        defaultValue={shortcut}
        placeholder="Press key for shortcut"
      />
      { showSaveIcon && <button onClick={this.onSave}>{'Save'}</button> }
      <button onClick={() => onRemoveClick(base, shortcut)}>{'Remove'}</button>
    </div>
    );
  }

}
